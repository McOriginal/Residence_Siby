import React, { useCallback, useRef, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { useAllPaiements } from '../../Api/queriesPaiement';
import { useAllContrat } from '../../Api/queriesContrat';
import { useAllDepenses } from '../../Api/queriesDepense';
import { useAllSecteur } from '../../Api/queriesSecteurs';
export default function PaiementBilans() {
  const {
    data: secteursData,
    isLoading: isLoadingSecteurs,
    error: errorSecteurs,
  } = useAllSecteur();
  const { data: paiementsData, isLoading, error } = useAllPaiements();
  const { data: contrats } = useAllContrat();
  const { data: depenses } = useAllDepenses();
  const tableRef = useRef(null);
  const [selectedSecteur, setSelectedSecteur] = useState(null);

  // State de Recherche
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const isBetweenDates = useCallback(
    (dateStr) => {
      if (!startDate || !endDate) return true; // si pas encore choisi, on ne filtre pas
      const date = new Date(dateStr).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // inclure toute la journée
      return date >= start && date <= end.getTime();
    },
    [startDate, endDate]
  );

  // Filtrer les Contrats
  const filterContrat = contrats
    ?.filter((item) => {
      return isBetweenDates(item?.startDate);
    })
    ?.filter((item) => {
      // Filtrer par secteur
      if (!selectedSecteur) return true;
      return item?.appartement?.secteur?._id === selectedSecteur;
    });
  // Fonction de Rechercher
  const filterPaiement = paiementsData
    ?.filter((item) => {
      // Filtrer par date
      return isBetweenDates(item.paiementDate);
    })
    ?.filter((item) => {
      // Filtrer par secteur
      if (!selectedSecteur) return true;
      return item?.contrat?.appartement?.secteur?._id === selectedSecteur;
    });

  // Fonction de Rechercher
  const filterDepense = depenses
    ?.filter((item) => {
      // Filtrer par date
      return isBetweenDates(item.dateOfDepense);
    })
    ?.filter((item) => {
      // Filtrer par secteur
      if (!selectedSecteur) return true;
      return item?.secteur?._id === selectedSecteur;
    });

  // Total de Contrat
  const sumTotalAmount = contrats?.reduce((curr, item) => {
    return (curr += item?.totalAmount);
  }, 0);

  // Total de Comission
  const sumTotalComission = contrats?.reduce((curr, item) => {
    return (curr += item?.comission);
  }, 0);

  // Total Payés
  const sumTotalPaye = filterPaiement?.reduce((curr, item) => {
    return (curr += item?.totalPaye);
  }, 0);

  // Total Dépenses
  const sumTotalDepense = filterDepense?.reduce((curr, item) => {
    return (curr += item?.totalAmount);
  }, 0);

  const revenueAmount = sumTotalPaye - sumTotalComission - sumTotalDepense;

  return (
    <Row>
      <Col lg={12}>
        <Card>
          <CardBody>
            <div id='bilanssList'>
              <Row className='g-4 mb-3 '>
                <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                  <h3>Bilans des Paiements</h3>
                  <div className='d-flex gap-1'>
                    <DownloadTableExcel
                      filename={`bilans de ${startDate} à ${endDate}`}
                      sheet={`bilans de ${startDate} à ${endDate}`}
                      currentTableRef={tableRef.current}
                    >
                      <Button color='success'>Télécharger en Excel</Button>
                    </DownloadTableExcel>
                  </div>
                </div>

                <div className='d-flex justify-content-between flex-wrap align-items-center gap-3'>
                  <div
                    md='12'
                    className='d-flex flex-column justify-content-around mt-4 flex-wrap'
                  >
                    <h6 className=''>
                      Contrats :{' '}
                      <span className='text-info'>
                        {formatPrice(filterContrat?.length)}
                      </span>
                    </h6>

                    <h6>
                      Total Payés:{' '}
                      <span className='text-success'>
                        {formatPrice(sumTotalPaye)} F{' '}
                      </span>
                    </h6>
                    <h6>
                      Sur:{' '}
                      <span className='text-info'>
                        {formatPrice(sumTotalAmount)} F
                      </span>
                    </h6>
                    <h6>
                      Total Comission:{' '}
                      <span className='text-danger'>
                        {formatPrice(sumTotalComission)} F
                      </span>
                    </h6>
                    <h6>
                      Total Réliquat:{' '}
                      <span className='text-danger'>
                        {formatPrice(sumTotalAmount - sumTotalPaye)} F{' '}
                      </span>
                    </h6>
                    <h6 className=''>
                      Dépenses:{' '}
                      <span className='text-danger'>
                        {formatPrice(sumTotalDepense)} F{' '}
                      </span>
                    </h6>

                    <h5>
                      Revenu Total:{' '}
                      <span
                        className={`${
                          revenueAmount > 0 ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {formatPrice(revenueAmount)} F{' '}
                      </span>
                    </h5>
                  </div>

                  <div className='d-flex flex-column gap-3'>
                    <Button
                      color='danger'
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        setSelectedSecteur(null);
                      }}
                    >
                      Effacer le Filtre
                    </Button>

                    <div md='3'>
                      <h6>Secteur</h6>
                      {isLoadingSecteurs && <LoadingSpiner />}
                      {errorSecteurs && (
                        <div className='text-danger'>
                          Erreur de chargement des secteurs
                        </div>
                      )}
                      {!isLoadingSecteurs &&
                        !errorSecteurs &&
                        secteursData?.length > 0 && (
                          <select
                            className='form-control p-2 border-1 border-warning text-info'
                            value={selectedSecteur ?? ''}
                            onChange={(e) =>
                              setSelectedSecteur(
                                e.target.value === '' ? null : e.target.value
                              )
                            }
                          >
                            <option value=''>Tous les Secteurs</option>
                            {secteursData?.map((secteur) => (
                              <option
                                key={secteur._id}
                                value={secteur._id}
                                className='text-info'
                              >
                                {capitalizeWords(secteur.adresse)}
                              </option>
                            ))}
                          </select>
                        )}
                    </div>
                    <div md='4'>
                      <h6>Date de début</h6>
                      <input
                        name='startDate'
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate ?? ''}
                        placeholder='Entrez la date de début'
                        type='date'
                        className='form-control p-2 border-1 border-dark'
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div md='4'>
                      <h6>Date de Fin</h6>
                      <input
                        name='endDate'
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate ?? ''}
                        placeholder='Entrez la date de Fin'
                        type='date'
                        className='form-control p-2 border-1 border-dark'
                        max={new Date().toISOString().split('T')[0]}
                        min={startDate ?? undefined}
                      />
                    </div>
                  </div>
                </div>
              </Row>
              {error && (
                <div className='text-danger text-center'>
                  Erreur de chargement des données
                </div>
              )}
              {isLoading && <LoadingSpiner />}

              <div className='table-responsive table-card mt-3 mb-1'>
                {filterPaiement?.length === 0 && (
                  <div className='text-center text-mutate'>
                    Aucun paiement trouver !
                  </div>
                )}
                <table
                  className='table align-middle table-nowrap table-hover'
                  id='paiementTable'
                  ref={tableRef}
                >
                  <thead className='table-light'>
                    <tr className='text-center'>
                      <th>Date de Paiement </th>
                      <th>Appartement N°</th>
                      <th>Secteur</th>
                      <th>Client</th>
                      <th>Pièce d'identité</th>
                      <th>Montant Payé</th>
                    </tr>
                  </thead>

                  <tbody className='list form-check-all text-center'>
                    {filterPaiement?.length > 0 &&
                      filterPaiement?.map((paiement) => {
                        const client = paiement?.contrat?.client;
                        const appartement = paiement?.contrat?.appartement;
                        const secteur = appartement?.secteur;
                        return (
                          <tr key={paiement?._id}>
                            <th scope='row'>
                              {new Date(
                                paiement?.paiementDate
                              ).toLocaleDateString()}
                            </th>
                            <td className='badge bg-info text-light'>
                              {formatPrice(appartement?.appartementNumber || 0)}
                            </td>
                            <td>{capitalizeWords(secteur?.adresse)}</td>
                            <td>
                              {capitalizeWords(
                                client?.firstName + ' ' + client?.lastName
                              )}
                            </td>

                            <td>{client?.pieceNumber}</td>
                            <td>{formatPrice(paiement?.totalPaye) || 0}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

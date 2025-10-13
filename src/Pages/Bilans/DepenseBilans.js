import React, { useCallback, useRef, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { useAllDepenses } from '../../Api/queriesDepense';
import { useAllSecteur } from '../../Api/queriesSecteurs';
export default function DepenseBilans() {
  const tableRef = useRef(null);
  const { data: depenseData, isLoading, error } = useAllDepenses();
  const {
    data: secteursData,
    isLoading: isLoadingSecteurs,
    error: errorSecteurs,
  } = useAllSecteur();
  // State de Recherche
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedSecteur, setSelectedSecteur] = useState(null);

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

  // Fonction de Rechercher
  const filterDepense = depenseData
    ?.filter((item) => {
      // Filtrer par date
      return isBetweenDates(item?.dateOfDepense);
    })
    ?.filter((item) => {
      // Filtrer par secteur
      if (!selectedSecteur) return true;
      return item?.secteur?._id === selectedSecteur;
    });

  const sumTotalDepense = filterDepense?.reduce((curr, item) => {
    return (curr += item?.totalAmount);
  }, 0);

  return (
    <Row>
      <Col lg={12}>
        <Card>
          <CardBody>
            <div id='bilanssList'>
              <Row className='g-4 mb-3 '>
                <div className='d-flex justify-content-center align-items-center gap-2'>
                  <h3>Bilans des Dépenses</h3>
                </div>

                <div className='d-flex justify-content-around flex-wrap align-items-center gap-3 my-4'>
                  <div className='d-flex gap-1'>
                    <DownloadTableExcel
                      filename={`bilans du ${startDate} au ${endDate}`}
                      sheet={`bilans du ${startDate} au ${endDate}`}
                      currentTableRef={tableRef.current}
                    >
                      <Button color='success'>Télécharger en Excel</Button>
                    </DownloadTableExcel>
                  </div>
                  <div
                    md='12'
                    className='d-flex flex-column justify-content-around mt-4 flex-wrap'
                  >
                    <h6 className=''>
                      Total Dépenses:{' '}
                      <span className='text-danger'>
                        {formatPrice(sumTotalDepense)} F{' '}
                      </span>
                    </h6>
                  </div>
                  <Button
                    color='danger'
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setSelectedSecteur(null);
                    }}
                  >
                    Effacer les Filtres
                  </Button>
                </div>

                <Row className='d-flex flex-wrap justify-content-around align-items-center gap-3'>
                  <Col md='3'>
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
                  </Col>

                  <Col md='3'>
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
                  </Col>
                  <Col md='3'>
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
                  </Col>
                </Row>
              </Row>
              {error && (
                <div className='text-danger text-center'>
                  Erreur de chargement des données
                </div>
              )}
              {isLoading && <LoadingSpiner />}

              <div className='table-responsive table-card mt-3 mb-1'>
                {filterDepense?.length === 0 && (
                  <div className='text-center text-mutate'>
                    Aucune Dépense trouvée !
                  </div>
                )}
                {!error && !isLoading && filterDepense.length > 0 && (
                  <table
                    className='table align-middle table-nowrap'
                    id='depenseTable'
                    ref={tableRef}
                  >
                    <thead className='table-light'>
                      <tr className='text-center '>
                        <th style={{ width: '50px' }}>Date de dépense</th>
                        <th>Appartement N°</th>
                        <th>Secteur</th>

                        <th>Motif de Dépense</th>
                        <th>Montant Dépensé</th>
                      </tr>
                    </thead>
                    <tbody className='list form-check-all'>
                      {filterDepense?.length > 0 &&
                        filterDepense?.map((depense) => (
                          <tr key={depense._id} className='text-center'>
                            <td>
                              {new Date(
                                depense.dateOfDepense
                              ).toLocaleDateString()}{' '}
                            </td>

                            <td className='badge bg-info text-light'>
                              {formatPrice(
                                depense?.appartement?.appartementNumber
                              )}
                            </td>
                            <td>
                              {capitalizeWords(depense?.secteur?.adresse)}
                            </td>
                            <td className='text-wrap'>
                              {capitalizeWords(depense.motifDepense)}
                            </td>

                            <td className='text-danger'>
                              {formatPrice(depense.totalAmount)}
                              {' F '}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

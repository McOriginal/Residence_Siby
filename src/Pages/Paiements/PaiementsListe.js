import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { useAllPaiements } from '../../Api/queriesPaiement';
import ReçuPaiement from './ReçuPaiement';
import {
  BackButton,
  DashboardButton,
  HomeButton,
} from '../components/NavigationButton';
import ActiveSecteur from '../Secteurs/ActiveSecteur';
import { useAllContrat } from '../../Api/queriesContrat';

export default function PaiementsListe() {
  const { data: paiementsData, isLoading, error } = useAllPaiements();
  const { data: contrats } = useAllContrat();
  const [selectedPaiement, setSelectedPaiement] = useState(false);
  const [selectedPaiementTotalPaye, setSelectedPaiementTotalPaye] = useState(0);
  const [show_modal, setShow_modal] = useState(false);

  const filterPaiement = paiementsData?.reduce((acc, item) => {
    // Vérifie si le contrat existe déjà dans l'accumulateur
    const existe = acc.find((it) => it?.contrat?._id === item?.contrat?._id);

    if (existe) {
      // Si déjà présent → on additionne totalPaye
      existe.totalPaye = (existe.totalPaye || 0) + (item.totalPaye || 0);
    } else {
      // Sinon → on ajoute le contrat avec son totalPaye initial
      acc.push({ ...item, totalPaye: item.totalPaye || 0 });
    }

    return acc;
  }, []);

  // Total de commandes
  const sumTotalAmount = contrats?.reduce((curr, item) => {
    return (curr += item?.totalAmount);
  }, 0);

  // Total Payés
  const sumTotalPaye = filterPaiement?.reduce((curr, item) => {
    return (curr += item?.totalPaye);
  }, 0);

  const sumTotalReliqua = filterPaiement?.reduce(
    (acc, item) => (acc += item?.contrat?.totalAmount - item?.totalPaye),
    0
  );

  // Ouverture de Modal Reçu Paiement
  function tog_show_modal() {
    setShow_modal(!show_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <ActiveSecteur />
        <Container fluid>
          <Breadcrumbs title='Transaction' breadcrumbItem='Paiements' />
          <div className='d-flex flex-wrap gap-4 justify-content-center align-items-center'>
            <BackButton />
            <DashboardButton />
            <HomeButton />
          </div>
          {/* -------------------- */}
          <ReçuPaiement
            show_modal={show_modal}
            tog_show_modal={tog_show_modal}
            selectedPaiementID={selectedPaiement}
            totalPaye={selectedPaiementTotalPaye}
          />
          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='paiementsList'>
                    <h6 className='text-end'>
                      Montant Total des Contrats:{' '}
                      <span className='text-info'>
                        {formatPrice(sumTotalAmount || 0)} F{' '}
                      </span>{' '}
                    </h6>
                    <h6 className='text-end'>
                      Total Net Payés:{' '}
                      <span className='text-success'>
                        {formatPrice(sumTotalPaye || 0)} F{' '}
                      </span>{' '}
                    </h6>
                    <h6 className='text-end'>
                      Total Reliquat:{' '}
                      <span className='text-danger'>
                        {formatPrice(sumTotalReliqua || 0)} F{' '}
                      </span>{' '}
                    </h6>
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
                      {!error && !isLoading && filterPaiement?.length > 0 && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='paiementTable'
                        >
                          <thead className='table-light'>
                            <tr className='text-center'>
                              <th data-sort='paiementDate'>Date de Paiement</th>
                              <th>Client</th>
                              <th>Téléphone</th>
                              <th>Total Contrat</th>
                              <th>Remise</th>
                              <th>Total après remise</th>
                              <th>Net Payé</th>
                              <th>Reliquat</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody className='list form-check-all text-center'>
                            {filterPaiement?.length > 0 &&
                              filterPaiement?.map((paiement) => (
                                <tr key={paiement?._id}>
                                  <th scope='row'>
                                    {new Date(
                                      paiement?.paiementDate
                                    ).toLocaleDateString()}
                                  </th>
                                  <td>
                                    {capitalizeWords(
                                      paiement?.contrat?.client.firstName +
                                        ' ' +
                                        paiement?.contrat?.client.lastName
                                    )}{' '}
                                  </td>
                                  <td>
                                    {formatPhoneNumber(
                                      paiement?.contrat?.client?.phoneNumber
                                    )}{' '}
                                  </td>
                                  <td>
                                    {formatPrice(
                                      paiement?.contrat?.amount || 0
                                    )}{' '}
                                    F
                                  </td>
                                  <td className='text-warning'>
                                    {formatPrice(
                                      paiement?.contrat?.reduction || 0
                                    )}{' '}
                                    F
                                  </td>
                                  <td>
                                    {formatPrice(
                                      paiement?.contrat?.totalAmount
                                    ) || 0}{' '}
                                    F
                                  </td>

                                  <td>
                                    {formatPrice(paiement?.totalPaye)}
                                    {' F '}
                                  </td>
                                  <td className='text-danger'>
                                    {formatPrice(
                                      paiement?.contrat?.totalAmount -
                                        paiement?.totalPaye || 0
                                    )}
                                    {' F '}
                                  </td>

                                  <td>
                                    <div className='d-flex gap-2'>
                                      <div>
                                        <button
                                          className='btn btn-sm btn-secondary show-item-btn'
                                          onClick={() => {
                                            setSelectedPaiement(paiement?._id);
                                            setSelectedPaiementTotalPaye(
                                              paiement?.totalPaye
                                            );
                                            tog_show_modal();
                                          }}
                                        >
                                          <i className='bx bx-show align-center text-white'></i>
                                        </button>
                                      </div>
                                    </div>
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
        </Container>
      </div>
    </React.Fragment>
  );
}

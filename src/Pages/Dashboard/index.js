import React from 'react';
import { motion } from 'framer-motion';

import { Row, Container, Col, Card, CardBody } from 'reactstrap';
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { companyName } from '../CompanyInfo/CompanyInfo';
import {
  TotalSecteur,
  TotalAppartement,
  TotalClient,
  TotalContrat,
} from './Total_Items';
import { useAllContrat } from '../../Api/queriesContrat';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import LoadingSpiner from '../components/LoadingSpiner';
import { useNavigate } from 'react-router-dom';
import AllReservationListe from '../Reservation/AllReservationListe';

const Dashboard = () => {
  document.title = `Tableau de Bord | ${companyName} `;

  const {
    data: contrats,
    isLoading: loadingContrat,
    error: errorContrat,
  } = useAllContrat();

  const navigate = useNavigate();

  const filterActualContrat = contrats?.filter((item) => {
    return item?.statut;
  });

  const today = new Date().toISOString().substring(0, 10);

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid={true}>
          <Breadcrumbs
            title='Administrateur'
            breadcrumbItem='Tabelau de Bord'
          />

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Row>
              <Col sm={3} md={6}>
                <TotalSecteur />
              </Col>

              <Col sm={3} md={6}>
                <TotalAppartement />
              </Col>

              <Col sm={3} md={6}>
                <TotalClient />
              </Col>

              <Col sm={3} md={6}>
                <TotalContrat />
              </Col>
            </Row>
          </motion.div>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='clientsList'>
                    <h3 className='text-center fw-bold'>Contrat en Cours</h3>
                    <Row className='g-4 mb-3'>
                      <Col>
                        <p className='text-center font-size-15 mt-2'>
                          Nombre:{' '}
                          <span className='badge bg-warning'>
                            {' '}
                            {filterActualContrat?.length}{' '}
                          </span>
                        </p>
                      </Col>
                    </Row>
                    {errorContrat && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {loadingContrat && <LoadingSpiner />}

                    <div
                      className='table-responsive table-card mt-3'
                      style={{ minHeight: 350 }}
                    >
                      {!filterActualContrat?.length &&
                        !loadingContrat &&
                        !errorContrat && (
                          <div className='text-center text-mutate'>
                            Aucun Contrat Enregistré !
                          </div>
                        )}
                      {!errorContrat &&
                        filterActualContrat?.length > 0 &&
                        !loadingContrat && (
                          <table
                            style={{
                              border: '2px solid #b1b1b1',
                              borderCollapse: 'collapse',
                            }}
                            className='table align-middle  table-nowrap table-hover'
                            id='contratTable'
                          >
                            <thead className='table-light'>
                              <tr className='text-center'>
                                <th>Statut</th>
                                <th>N° d'appartement</th>
                                <th>Secteur</th>
                                <th>Client</th>
                                <th>Téléphone</th>
                                <th>Date d'entrée</th>
                                <th>Date de Sortie</th>
                                <th>Mois</th>
                                <th>Semaine</th>

                                <th>Jour</th>
                                <th>Heure</th>
                                <th>Montant</th>
                                <th>Remise</th>
                                <th>Après Remise</th>

                                <th>Action</th>
                              </tr>
                            </thead>

                            <tbody className='list form-check-all text-center'>
                              {filterActualContrat?.map((contrat) => (
                                <tr key={contrat?._id} className='text-center'>
                                  <td
                                    className={` text-light ${
                                      contrat?.statut
                                        ? 'bg-success'
                                        : 'bg-danger'
                                    }`}
                                  >
                                    {contrat?.statut ? 'En cours' : 'Terminé'}
                                  </td>
                                  <td className='badge bg-info  rounded rounded-pill text-center text-light'>
                                    {formatPrice(
                                      contrat?.appartement?.appartementNumber
                                    )}
                                  </td>
                                  <td>
                                    {contrat?.appartement?.secteur?.adresse}
                                  </td>
                                  <td>
                                    {capitalizeWords(
                                      contrat?.client?.firstName +
                                        ' ' +
                                        contrat?.client?.lastName
                                    )}{' '}
                                  </td>
                                  <td>
                                    {formatPhoneNumber(
                                      contrat?.client?.phoneNumber
                                    )}{' '}
                                  </td>
                                  <td>
                                    {new Date(
                                      contrat?.startDate
                                    ).toLocaleDateString('fr-Fr', {
                                      weekday: 'short',
                                      day: '2-digit',
                                      month: 'numeric',
                                      year: 'numeric',
                                    })}{' '}
                                  </td>
                                  <td
                                    className={`${
                                      new Date(contrat?.endDate)
                                        .toISOString()
                                        .substring(0, 10) > today
                                        ? 'text-success'
                                        : new Date(contrat.endDate)
                                            .toISOString()
                                            .substring(0, 10) < today
                                        ? 'text-danger'
                                        : new Date(contrat.endDate)
                                            .toISOString()
                                            .substring(0, 10) === today
                                        ? 'text-warning'
                                        : ''
                                    }`}
                                  >
                                    {new Date(
                                      contrat?.endDate
                                    ).toLocaleDateString('fr-Fr', {
                                      weekday: 'short',
                                      day: '2-digit',
                                      month: 'numeric',
                                      year: 'numeric',
                                    })}{' '}
                                  </td>

                                  <td>{formatPrice(contrat.mois)} </td>

                                  <td>{formatPrice(contrat.semaine || 0)}</td>
                                  <td>{formatPrice(contrat.jour || 0)}</td>
                                  <td>{formatPrice(contrat.heure || 0)}</td>
                                  <td>{formatPrice(contrat.amount || 0)} F</td>
                                  <td>
                                    {formatPrice(contrat.reduction || 0)} F
                                  </td>
                                  <td>
                                    {formatPrice(contrat.totalAmount || 0)} F
                                  </td>

                                  <td className='text-center'>
                                    <i className='fas fa-book-open align-center me-2 '></i>
                                    <strong
                                      style={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        color: ' #99c132',
                                      }}
                                      onClick={() => {
                                        navigate(
                                          `/contrat/document/${contrat._id}`
                                        );
                                      }}
                                    >
                                      Contrat
                                    </strong>
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

          <AllReservationListe />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;

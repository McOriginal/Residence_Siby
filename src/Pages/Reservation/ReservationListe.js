import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import { useParams } from 'react-router-dom';
import {
  BackButton,
  DashboardButton,
  HomeButton,
} from '../components/NavigationButton';
import { useAllRental, useDeleteRental } from '../../Api/queriesReservation';
import ReservationForm from './ReservationForm';
import { connectedUserRole } from '../Authentication/userInfos';
export default function ReservationListe() {
  const param = useParams();
  const [form_modal, setForm_modal] = useState(false);
  const { data: rentalsData, isLoading, error } = useAllRental();

  const { mutate: deleteRental, isLoading: isDeleting } = useDeleteRental();

  const [rentalToUpdate, setRentalToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState(
    'Ajouter une Reservation'
  );
  // State de Rechercher
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour filtrer les clients en fonction du terme de recherche
  const filteredRental = rentalsData?.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item?.client?._id.toString() === param.id.toString() &&
      (`${item?.client?.firstName} ${item?.client?.lastName}`
        .toLowerCase()
        .includes(search) ||
        item?.client?.phoneNumber.toString().includes(search) ||
        item?.appartement?.secteur.adresse?.toString().includes(search) ||
        new Date(item?.rentalDate)?.toLocaleDateString().includes(search))
    );
  });

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Client' breadcrumbItem='List des Reservation' />
          <div className='d-flex flex-wrap justify-content-center align-items-center gap-4'>
            <BackButton />
            <DashboardButton />
            <HomeButton />
          </div>
          {/* -------------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <ReservationForm
                reservationToEdit={rentalToUpdate}
                clientId={param.id}
                tog_form_modal={tog_form_modal}
              />
            }
          />
          {/* -------------------------------- */}

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='clientsList'>
                    <Row className='g-4 mb-3 d-felx flex-wrap align-items-center justify-content-center justify-content-md-between'>
                      {connectedUserRole === 'admin' && (
                        <Col md={4} className='col-sm-auto'>
                          <div className='d-flex gap-1'>
                            <Button
                              color='info'
                              className='add-btn'
                              id='create-btn'
                              onClick={() => {
                                setRentalToUpdate(null);
                                tog_form_modal();
                              }}
                            >
                              <i className='fas fa-clock align-center me-1'></i>{' '}
                              Faire une Reservation
                            </Button>
                          </div>
                        </Col>
                      )}
                      <Col md={4}>
                        <p className='font-size-15 mt-2'>
                          Nombre:{' '}
                          <span className='badge bg-warning'>
                            {' '}
                            {filteredRental?.length}{' '}
                          </span>
                        </p>
                      </Col>
                      <Col md={4} className='col-sm'>
                        <div className='d-flex justify-content-sm-end gap-2'>
                          {searchTerm !== '' && (
                            <Button
                              color='danger'
                              onClick={() => setSearchTerm('')}
                            >
                              <i className='fas fa-window-close'></i>
                            </Button>
                          )}
                          <div className='search-box me-4'>
                            <input
                              type='text'
                              className='form-control search border border-dark rounded'
                              placeholder='Rechercher...'
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div
                      className='table-responsive table-card mt-3'
                      style={{ minHeight: 350 }}
                    >
                      {!filteredRental?.length && !isLoading && !error && (
                        <div className='text-center text-mutate'>
                          Aucune Reservation Enregistré !
                        </div>
                      )}
                      {!error && filteredRental?.length > 0 && !isLoading && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='contratTable'
                        >
                          <thead className='table-light'>
                            <tr className='text-center'>
                              <th>Début</th>
                              <th>Fin</th>
                              <th>N° d'Appartement</th>
                              <th>Secteur</th>
                              <th>Client</th>
                              <th>Téléphone</th>
                              <th>Montant Payé</th>
                              <th>Mois</th>
                              <th>Semaine</th>

                              <th>Jour</th>
                              <th>Heure</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody className='list form-check-all text-center'>
                            {filteredRental?.map((item) => (
                              <tr key={item?._id} className='text-center'>
                                <td>
                                  {new Date(
                                    item?.rentalDate
                                  ).toLocaleDateString('fr-Fr', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: 'numeric',
                                    year: 'numeric',
                                  })}
                                </td>
                                <td
                                  className={` text-light ${
                                    new Date(item?.rentalEndDate) > new Date()
                                      ? 'bg-warning'
                                      : new Date(item?.rentalEndDate) ===
                                        new Date()
                                      ? 'bg-success'
                                      : 'bg-danger'
                                  }`}
                                >
                                  {new Date(
                                    item?.rentalEndDate
                                  ).toLocaleDateString('fr-Fr', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: 'numeric',
                                    year: 'numeric',
                                  })}
                                </td>
                                <td className='badge bg-info  rounded rounded-pill text-center text-light'>
                                  {formatPrice(
                                    item?.appartement?.appartementNumber
                                  )}
                                </td>
                                <td>{item?.appartement?.secteur?.adresse}</td>
                                <td>
                                  {capitalizeWords(
                                    item?.client?.firstName +
                                      ' ' +
                                      item?.client?.lastName
                                  )}{' '}
                                </td>
                                <td>
                                  {formatPhoneNumber(item?.client?.phoneNumber)}{' '}
                                </td>

                                <td>{formatPrice(item.totalPaye || 0)} F</td>
                                <td>{formatPrice(item.mois || 0)} </td>
                                <td>{formatPrice(item.semaine || 0)}</td>
                                <td>{formatPrice(item.jour || 0)}</td>
                                <td>{formatPrice(item.heure || 0)}</td>

                                {connectedUserRole === 'admin' && (
                                  <td className='text-center'>
                                    <div className='d-flex gap-2'>
                                      <div className='edit'>
                                        <button
                                          className='btn btn-sm btn-success edit-item-btn'
                                          onClick={() => {
                                            setFormModalTitle(
                                              'Modifier les données'
                                            );
                                            setRentalToUpdate(item);
                                            tog_form_modal();
                                          }}
                                        >
                                          <i className='ri-pencil-fill text-white'></i>
                                        </button>
                                      </div>
                                      {isDeleting && <LoadingSpiner />}
                                      {!isDeleting && (
                                        <div className='remove'>
                                          <button
                                            className='btn btn-sm btn-danger remove-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#deleteRecordModal'
                                            onClick={() => {
                                              deleteButton(
                                                item._id,
                                                `La Reservation de ${
                                                  item?.client?.firstName +
                                                  ' ' +
                                                  item?.client.lastName
                                                } 
                                                                                     `,
                                                deleteRental
                                              );
                                            }}
                                          >
                                            <i className='ri-delete-bin-fill text-white'></i>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                )}
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

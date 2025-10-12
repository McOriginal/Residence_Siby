import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { useAllRental } from '../../Api/queriesReservation';
export default function AllReservationListe() {
  const { data: rentalsData, isLoading, error } = useAllRental();

  // State de Rechercher
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour filtrer les clients en fonction du terme de recherche
  const filteredRental = rentalsData?.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      `${item?.client?.firstName} ${item?.client?.lastName}`
        .toLowerCase()
        .includes(search) ||
      item?.client?.phoneNumber.toString().includes(search) ||
      item?.appartement?.secteur.adresse?.toString().includes(search) ||
      new Date(item?.rentalDate)?.toLocaleDateString().includes(search)
    );
  });

  return (
    <Row>
      <Col lg={12}>
        <Card>
          <CardBody>
            <div id='clientsList'>
              <h3 className='text-center fw-bold'>Reservations</h3>
              <Row className='g-4 mb-3 d-felx flex-wrap align-items-center justify-content-center justify-content-md-between'>
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
                      <Button color='danger' onClick={() => setSearchTerm('')}>
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
                        <th>Date de Reservation</th>
                        <th>N° d'Appartement</th>
                        <th>Secteur</th>
                        <th>Client</th>
                        <th>Téléphone</th>
                        <th>Mois</th>
                        <th>Semaine</th>

                        <th>Jour</th>
                        <th>Heure</th>
                      </tr>
                    </thead>

                    <tbody className='list form-check-all text-center'>
                      {filteredRental?.map((item) => (
                        <tr key={item?._id} className='text-center'>
                          <td
                            className={` text-light ${
                              new Date(item?.rentalDate) > new Date()
                                ? 'bg-warning'
                                : new Date(item?.rentalDate) === new Date()
                                ? 'bg-success'
                                : 'bg-danger'
                            }`}
                          >
                            {new Date(item?.rentalDate).toLocaleDateString(
                              'fr-Fr',
                              {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </td>
                          <td className='badge bg-info  rounded rounded-pill text-center text-light'>
                            {formatPrice(item?.appartement?.appartementNumber)}
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

                          <td>{formatPrice(item.mois || 0)} </td>
                          <td>{formatPrice(item.semaine || 0)}</td>
                          <td>{formatPrice(item.jour || 0)}</td>
                          <td>{formatPrice(item.heure || 0)}</td>
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

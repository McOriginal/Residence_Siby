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
import { useAllContrat, useDeleteContrat } from '../../Api/queriesContrat';
import { useNavigate } from 'react-router-dom';
import ContratForm from './ContratForm';
export default function ContratListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: contratData, isLoading, error } = useAllContrat();
  const { mutate: deleteContrat, isDeleting } = useDeleteContrat();
  const [contratToUpdate, setContratToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Nouveau Contrat');

  const navigate = useNavigate();
  // State de Rechercher
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour filtrer les clients en fonction du terme de recherche
  const filteredContrat = contratData?.filter((contrat) => {
    const search = searchTerm.toLowerCase();
    return (
      `${contrat?.client?.firstName} ${contrat?.client?.lastName}`
        .toLowerCase()
        .includes(search) ||
      contrat?.client?.phoneNumber.toString().includes(search)
    );
  });

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Secteurs' breadcrumbItem='List des Contrat' />

          {/* -------------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <ContratForm
                contratToEdit={contratToUpdate}
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
                    <Row className='g-4 mb-3'>
                      <Col>
                        <p className='text-center font-size-15 mt-2'>
                          Nombre:{' '}
                          <span className='text-warning'>
                            {' '}
                            {contratData?.length}{' '}
                          </span>
                        </p>
                      </Col>
                      <Col className='col-sm'>
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

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {!filteredContrat?.length && !isLoading && !error && (
                        <div className='text-center text-mutate'>
                          Aucun Contrat Enregistré !
                        </div>
                      )}
                      {!error && filteredContrat?.length > 0 && !isLoading && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='fournisseurTable'
                        >
                          <thead className='table-light'>
                            <tr className='text-center'>
                              <th>N° d'Appartement</th>
                              <th>Client</th>
                              <th>Téléphone</th>
                              <th>Date D'Entrée</th>
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
                            {filteredContrat?.map((contrat) => (
                              <tr key={contrat?._id} className='text-center'>
                                <th className='badge bg-secondary  rounded rounded-pill text-center text-light'>
                                  {formatPrice(
                                    contrat?.appartement?.appartementNumber
                                  )}{' '}
                                </th>
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
                                  {new Date(contrat.endDate).toLocaleDateString(
                                    'fr-Fr',
                                    {
                                      weekday: 'short',
                                      day: '2-digit',
                                      month: 'numeric',
                                      year: 'numeric',
                                    }
                                  )}{' '}
                                </td>
                                <td>
                                  {new Date(
                                    contrat.startDate
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
                                <td>{formatPrice(contrat.reduction || 0)} F</td>
                                <td>
                                  {formatPrice(contrat.totalAmount || 0)} F
                                </td>

                                <td className='text-center'>
                                  <div className='d-flex justify-content-center align-items-center gap-2'>
                                    <div className='edit'>
                                      <button
                                        className='btn btn-sm btn-warning'
                                        onClick={() => {
                                          navigate(
                                            `/contrat/document/${contrat._id}`
                                          );
                                        }}
                                      >
                                        <i className='fas fa-file text-white'></i>
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        className='btn btn-sm btn-success edit-item-btn'
                                        onClick={() => {
                                          setFormModalTitle(
                                            'Modifier les données'
                                          );
                                          setContratToUpdate(contrat);
                                          tog_form_modal();
                                        }}
                                      >
                                        <i className='ri-pencil-fill text-white'></i>
                                      </button>
                                    </div>
                                    {isDeleting && <LoadingSpiner />}
                                    {!isDeleting && (
                                      <div>
                                        <button
                                          className='btn btn-sm btn-danger remove-item-btn'
                                          onClick={() => {
                                            deleteButton(
                                              contrat?._id,
                                              contrat?.client?.firstName +
                                                ' ' +
                                                contrat?.client?.lastName,
                                              deleteContrat
                                            );
                                          }}
                                        >
                                          <i className='ri-delete-bin-fill text-white'></i>
                                        </button>
                                      </div>
                                    )}
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

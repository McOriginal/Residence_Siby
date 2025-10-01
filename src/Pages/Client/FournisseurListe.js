import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import { useAllClient, useDeleteClient } from '../../Api/queriesClient';
import ClientForm from './ClientForm';

export default function ClientListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: clientData, isLoading, error } = useAllClient();
  const { mutate: deleteClient, isDeleting } = useDeleteClient();
  const [clientToUpdate, setClientToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Client');

  // State de Rechercher
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour filtrer les clients en fonction du terme de recherche
  const filteredClient = clientData?.filter((client) => {
    const search = searchTerm.toLowerCase();
    return (
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(search) ||
      client.phoneNumber.toString().includes(search)
    );
  });

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Secteurs' breadcrumbItem='List des Client' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <ClientForm
                fournisseurToEdit={clientToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='clientsList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setClientToUpdate(null);
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-user align-center me-1'></i>{' '}
                            Ajouter un Client
                          </Button>
                        </div>
                      </Col>
                      <Col>
                        <p className='text-center font-size-15 mt-2'>
                          Total Clients:{' '}
                          <span className='text-warning'>
                            {' '}
                            {filteredClient?.length}{' '}
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
                      {!filteredClient?.length && !isLoading && !error && (
                        <div className='text-center text-mutate'>
                          Aucun Clients trouvée !
                        </div>
                      )}
                      {!error && filteredClient?.length > 0 && !isLoading && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='fournisseurTable'
                        >
                          <thead className='table-light'>
                            <tr className='text-center'>
                              <th scope='col' style={{ width: '50px' }}>
                                ID
                              </th>
                              <th>Nom</th>
                              <th>Prénom</th>

                              <th>Téléphone</th>

                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody className='list form-check-all text-center'>
                            {filteredClient?.map((client, index) => (
                              <tr key={client._id} className='text-center'>
                                <th scope='row'>{index + 1}</th>
                                <td>{capitalizeWords(client.firstName)} </td>
                                <td>{capitalizeWords(client.lastName)} </td>

                                <td>{formatPhoneNumber(client.phoneNumber)}</td>

                                <td className='text-center'>
                                  <div className='d-flex justify-content-center align-items-center gap-2'>
                                    <div className='edit'>
                                      <button
                                        className='btn btn-sm btn-success edit-item-btn'
                                        data-bs-toggle='modal'
                                        data-bs-target='#showModal'
                                        onClick={() => {
                                          setFormModalTitle(
                                            'Modifier les données'
                                          );
                                          setClientToUpdate(client);
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
                                              client._id,
                                              client.firstName +
                                                ' ' +
                                                client.lastName,
                                              deleteClient
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

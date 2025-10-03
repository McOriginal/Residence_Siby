import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import FormModal from '../components/FormModal';
import SecteurForm from './SecteurForm';
import { useState } from 'react';
import { useAllSecteur, useDeleteSecteur } from '../../Api/queriesSecteurs';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import { useNavigate } from 'react-router-dom';
import { useAllAppartement } from '../../Api/queriesAppartement';

export default function Secteur() {
  const [form_modal, setForm_modal] = useState(false);
  const [secteurToUpdate, setSecteurToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Nouveau Secteur');
  const navigate = useNavigate();
  const {
    data: secteurData,
    isLoading: loadingData,
    error: dataError,
  } = useAllSecteur();
  const { mutate: deleteSecteur } = useDeleteSecteur();

  const { data: appartementData } = useAllAppartement();

  const appartements = (secteur, disponibility) => {
    return appartementData?.filter((item) => {
      return item?.secteur?._id === secteur?._id;
    })?.length;
  };

  const availableAppartements = (secteur, disponibility) => {
    return appartementData?.filter((item) => {
      return (
        item?.secteur?._id === secteur?._id &&
        item?.isAvailable === disponibility
      );
    })?.length;
  };

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }

  return (
    <>
      <div className='page-content bg-primary'>
        <Container fluid={true}>
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <SecteurForm
                secteurToEdit={secteurToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />
          <h3 className='text-center'> Secteurs Disponible</h3>
          <Button
            color='info'
            className='mx-auto my-3 d-flex justify-content-center align-items-center'
            onClick={() => {
              setSecteurToUpdate(null);
              tog_form_modal();
            }}
          >
            Ajouter un Secteur
          </Button>

          {dataError && (
            <div className='text-danger text-center my-4'>
              <h6>
                Oh..Oh....une erreur c'est produit veuillez actualisez la page
              </h6>
            </div>
          )}

          {loadingData && <LoadingSpiner />}
          {!dataError && !loadingData && (
            <Row className='d-flex flex-wrap gap-4 justify-content-center align-items-center'>
              {secteurData?.length > 0 &&
                secteurData?.map((item) => (
                  <Col id={item?._id} sm={4} md={5}>
                    <Card
                      style={{
                        position: 'relative',
                        padding: '10px 15px',
                        border: '2px solid #f1fafeee ',
                        boxShadow: '0 0 10px rgba(2, 48, 71, 0.37)',
                        background: ' #023047',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 2,
                        }}
                      >
                        <UncontrolledDropdown className='dropdown d-inline-block'>
                          <DropdownToggle
                            className='btn btn-soft-secondary btn-sm'
                            tag='button'
                          >
                            <i className='fas fa-ellipsis-v fs-5 text-primary'></i>
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu-end'>
                            <DropdownItem
                              className='edit-item-btn  text-secondary'
                              onClick={() => {
                                setFormModalTitle('Modifier les données');
                                setSecteurToUpdate(item);
                                tog_form_modal();
                              }}
                            >
                              <i className='ri-pencil-fill align-bottom me-2 '></i>
                              Modifier
                            </DropdownItem>

                            <DropdownItem
                              className='remove-item-btn text-danger '
                              onClick={() => {
                                deleteButton(
                                  item?._id,
                                  item?.name,
                                  deleteSecteur
                                );
                              }}
                            >
                              {' '}
                              <i className='ri-delete-bin-fill align-bottom me-2 '></i>{' '}
                              Supprimer{' '}
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                      <h5 className='text-light'>
                        Secteur N° {item.secteurNumber}
                      </h5>

                      <CardBody className='d-flex flex-column justify-content-center align-items-center text-light'>
                        <h5 className='text-light'>
                          {capitalizeWords(item?.adresse)}
                        </h5>
                        <span
                          className={`mb-2 ${
                            appartements(item) > 0
                              ? 'text-success'
                              : 'text-danger'
                          }`}
                        >
                          {formatPrice(appartements(item))} Appartements
                        </span>
                        <span
                          className={`badge ${
                            availableAppartements(item, false) > 0
                              ? 'bg-success'
                              : 'bg-danger'
                          }`}
                        >
                          {formatPrice(availableAppartements(item, false))}{' '}
                          Disponible
                        </span>
                      </CardBody>
                      <CardFooter className='d-flex justify-content-end align-items-center'>
                        <Button
                          className='text-end'
                          color='info'
                          onClick={() => {
                            localStorage.setItem(
                              'selectedSecteur',
                              JSON.stringify(item)
                            );
                            navigate(`/secteur/${item?._id}`);
                          }}
                        >
                          <i className=' fas fa-angle-double-right'></i>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Col>
                ))}
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}

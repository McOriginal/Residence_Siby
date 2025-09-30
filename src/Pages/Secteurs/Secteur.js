import {
  Button,
  Card,
  CardBody,
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

  const appartements = (secteur) => {
    return appartementData?.filter((item) => {
      return item?.secteur?._id === secteur?._id;
    })?.length;
  };

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }

  return (
    <>
      <div className='page-content'>
        <Container fluid={false}>
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
          <CardTitle className='text-center'> Secteurs Disponible</CardTitle>
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
                      onClick={() => navigate(`/secteur/${item?._id}`)}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        padding: '10px 15px',
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
                            <i className='fas fa-ellipsis-v fs-5 text-info'></i>
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
                      <CardTitle>Secteur N° {item.secteurNumber}</CardTitle>

                      <CardBody className='d-flex flex-column justify-content-center align-items-center'>
                        <CardTitle>{capitalizeWords(item?.adresse)}</CardTitle>
                        <span
                          className={`badge ${
                            appartements(item) > 0 ? 'bg-info' : 'bg-danger'
                          }`}
                        >
                          {formatPrice(appartements(item))} appartement{' '}
                        </span>
                      </CardBody>
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

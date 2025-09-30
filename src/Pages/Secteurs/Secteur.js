import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import FormModal from '../components/FormModal';
import SecteurForm from './SecteurForm';
import { useState } from 'react';
import { useAllSecteur } from '../../Api/queriesSecteurs';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords } from '../components/capitalizeFunction';

export default function Secteur() {
  const [form_modal, setForm_modal] = useState(false);
  const [secteurToUpdate, setSecteurToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Nouveau Secteur');
  const {
    data: secteurData,
    isLoading: loadingData,
    error: dataError,
  } = useAllSecteur();

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
                secteurData?.map((item, index) => (
                  <Col id={index} md={5} lg={3}>
                    <Card className='d-flex flex-column justify-content-center align-items-center'>
                      <CardTitle>Secteur N° {item.secteurNumber}</CardTitle>
                      <CardBody>
                        <CardTitle>{capitalizeWords(item?.adresse)}</CardTitle>
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

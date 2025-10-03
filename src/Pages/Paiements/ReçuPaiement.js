import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  Modal,
} from 'reactstrap';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import html2pdf from 'html2pdf.js';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useOnePaiement } from '../../Api/queriesPaiement';
import { companyName } from '../CompanyInfo/CompanyInfo';
import RecuHeader from './ReçueHeader';

const ReçuPaiement = ({
  show_modal,
  tog_show_modal,
  selectedPaiementID,
  totalPaye,
  totalReliqua,
}) => {
  const {
    data: selectedPaiement,
    error,
    isLoading,
  } = useOnePaiement(selectedPaiementID);

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  // ------------------------------------------
  // ------------------------------------------
  // Export En PDF
  // ------------------------------------------
  // ------------------------------------------
  const exportPaiementToPDF = () => {
    const element = document.getElementById('reçu_de_paiement');
    const opt = {
      filename: 'reçu_de_paiement.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .catch((err) => console.error('Error generating PDF:', err));
  };

  return (
    <Modal
      isOpen={show_modal}
      toggle={() => {
        tog_show_modal();
      }}
      size={'lg'}
      scrollable={true}
      centered={true}
    >
      {/* ---- Modal Header */}
      <div className='modal-header'>
        <div className='d-flex gap-1 justify-content-around align-items-center w-100'>
          <Button
            color='info'
            className='add-btn'
            id='create-btn'
            onClick={reactToPrintFn}
          >
            <i className='fas fa-print align-center me-1'></i> Imprimer
          </Button>

          <Button color='danger' onClick={exportPaiementToPDF}>
            <i className='fas fa-paper-plane  me-1 '></i>
            Télécharger en PDF
          </Button>
        </div>

        <button
          type='button'
          onClick={() => tog_show_modal()}
          className='close'
          data-dismiss='modal'
          aria-label='Close'
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>

      {/* Modal Body */}
      <div className='modal-body' ref={contentRef}>
        {!error && !isLoading && (
          <div
            className='mx-5 py-3 d-flex justify-content-center'
            id='reçu_de_paiement'
          >
            <Card
              style={{
                boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                borderRadius: '15px',
                width: '583px',
                margin: '20px auto',
                position: 'relative',
                padding: '10px 0',
                border: '2px solid #c222ab',
              }}
            >
              <RecuHeader />
              <CardBody className='mt-2'>
                <div className='d-flex justify-content-center align-items-center flex-column'>
                  <h5 className='mb-4'>Reçue de Paiement</h5>
                  <p>
                    {capitalizeWords(
                      selectedPaiement?.contrat?.client?.firstName +
                        ' ' +
                        selectedPaiement?.contrat?.client?.lastName
                    )}
                  </p>
                  <p>
                    {formatPhoneNumber(
                      selectedPaiement?.contrat?.client?.phoneNumber
                    )}
                  </p>
                  <p>
                    <strong>Appartement:</strong>
                    <span>
                      ( N°{' '}
                      {formatPhoneNumber(
                        selectedPaiement?.contrat?.appartement
                          ?.appartementNumber
                      )}
                      )
                    </span>
                    <span>
                      {capitalizeWords(
                        selectedPaiement?.contrat?.appartement?.name
                      )}{' '}
                    </span>
                    <strong>{' | Adresse: '}</strong>
                    <span>
                      {capitalizeWords(
                        selectedPaiement?.contrat?.appartement?.secteur?.adresse
                      )}{' '}
                    </span>
                  </p>
                </div>

                <div className='d-flex justify-content-around align-items-center  px-2 '>
                  <div>
                    <CardText>
                      <strong> Date d'Entrée:</strong>{' '}
                      {new Date(
                        selectedPaiement?.contrat?.startDate
                      ).toLocaleDateString('fr-Fr', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'numeric',
                        year: 'numeric',
                      })}
                    </CardText>
                    <CardText>
                      <strong> Date de Sortie:</strong>{' '}
                      {new Date(
                        selectedPaiement?.contrat?.endDate
                      ).toLocaleDateString('fr-Fr', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'numeric',
                        year: 'numeric',
                      })}
                    </CardText>
                    <h6>Durée: </h6>
                    {selectedPaiement?.contrat?.mois > 0 && (
                      <CardText>
                        ( {formatPrice(selectedPaiement?.contrat?.mois || 0)}){' '}
                        <strong> Mois</strong>
                      </CardText>
                    )}
                    {selectedPaiement?.contrat?.semaine > 0 && (
                      <CardText>
                        ({formatPrice(selectedPaiement?.contrat?.semaine || 0)}){' '}
                        <strong> Semaine</strong>
                      </CardText>
                    )}
                    {selectedPaiement?.contrat?.jour > 0 && (
                      <CardText>
                        ( {formatPrice(selectedPaiement?.contrat?.jour || 0)}){' '}
                        <strong> Jour</strong>
                      </CardText>
                    )}
                    {selectedPaiement?.contrat?.heure > 0 && (
                      <CardText>
                        ({formatPrice(selectedPaiement?.contrat?.heure || 0)}){' '}
                        <strong> Heure</strong>
                      </CardText>
                    )}
                  </div>
                  <div
                    className='border border-1 border-dark'
                    style={{ width: '2px', height: '160px' }}
                  ></div>

                  <div className='my-3'>
                    <CardText>
                      <strong> Montant Total: </strong>
                      {formatPrice(selectedPaiement?.contrat?.totalAmount)} F
                    </CardText>
                    <CardText>
                      <strong>Net Payé: </strong>
                      {formatPrice(totalPaye || selectedPaiement?.totalPaye)} F
                    </CardText>
                    <CardText>
                      <strong> Reliquat: </strong>
                      {formatPrice(
                        selectedPaiement?.contrat?.totalAmount - totalPaye ||
                          totalReliqua
                      )}{' '}
                      F
                    </CardText>
                    <CardText>
                      <strong> Date de paiement:</strong>{' '}
                      {new Date(
                        selectedPaiement?.paiementDate
                      ).toLocaleDateString('fr-Fr', {
                        weekday: 'long',
                        year: 'numeric',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </CardText>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                {' '}
                <p className='font-size-10 text-center'>
                  Merci pour votre confiance et service chez {companyName}. Nous
                  espérons vous revoir bientôt!
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReçuPaiement;

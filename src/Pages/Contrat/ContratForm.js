import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  useCreateContrat,
  useReloadContrat,
  useUpdateContrat,
} from '../../Api/queriesContrat';
import { useAllAppartement } from '../../Api/queriesAppartement';
import { formatPrice } from '../components/capitalizeFunction';

const ContratForm = ({
  contratToEdit,
  clientId,
  contratToReload,
  tog_form_modal,
}) => {
  const { mutate: createContrat } = useCreateContrat();
  const { mutate: reloadContrat } = useReloadContrat();
  const { mutate: updateContrat } = useUpdateContrat();
  const {
    data: appartment,
    isLoading: loadingAppart,
    error: errorAppart,
  } = useAllAppartement();

  const [isLoading, setIsLoading] = useState(false);

  const storage = localStorage.getItem('selectedSecteur');
  const secteurStorage = JSON.parse(storage);
  const secteurAppartement = appartment?.filter(
    (item) =>
      item?.secteur?._id === secteurStorage?._id &&
      (item.isAvailable || item?._id === contratToEdit?.appartement?._id)
  );
  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      client:
        contratToEdit?.client?._id || contratToReload?.client?._id || clientId,
      appartement:
        contratToEdit?.appartement?._id ||
        contratToReload?.appartement?._id ||
        undefined,
      heure: contratToEdit?.heure || contratToReload?.heure || 0,
      jour: contratToEdit?.jour || contratToReload?.jour || 0,
      semaine: contratToEdit?.semaine || contratToReload?.semaine || 0,
      mois: contratToEdit?.mois || contratToReload?.mois || 0,
      startDate: contratToEdit?.startDate.substring(0, 10) || undefined,
      endDate: contratToEdit?.endDate.substring(0, 10) || undefined,
      amount: contratToEdit?.amount || contratToReload?.amount || undefined,
      reduction:
        contratToEdit?.reduction || contratToReload?.reduction || undefined,
      totalAmount:
        contratToEdit?.totalAmount || contratToReload?.totalAmount || undefined,
      comission: contratToEdit?.comission || undefined,
    },
    validationSchema: Yup.object({
      appartement: Yup.string().required('Ce Champ est Obligatoire'),
      heure: Yup.number(),
      jour: Yup.number(),
      semaine: Yup.number(),
      mois: Yup.number(),
      startDate: Yup.date().required('Ce champ est obligatoire'),
      endDate: Yup.date().required('Ce champ est obligatoire'),
      totalAmount: Yup.number(),
      amount: Yup.number().required('Ce Champ est Obligatoire'),
      reduction: Yup.number(),
      comission: Yup.number(),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      if (contratToEdit) {
        return updateContrat(
          { id: contratToEdit._id, data: values },
          {
            onSuccess: () => {
              successMessageAlert('Données mise à jour avec succès');
              setIsLoading(false);
              tog_form_modal();
            },
            onError: (err) => {
              errorMessageAlert(
                err?.response?.data?.message ||
                  err?.message ||
                  'Erreur lors de la mise à jour'
              );
              setIsLoading(false);
            },
          }
        );
      }

      // Si c'est pour Renouveller
      if (contratToReload) {
        return reloadContrat(
          { contrat: contratToReload?._id, ...values },
          {
            onSuccess: () => {
              successMessageAlert('Contrat Renouvellée avec succès');
              setIsLoading(false);
              resetForm();
              tog_form_modal();
            },
            onError: (err) => {
              const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Oh Oh ! une erreur est survenu lors de l'enregistrement";
              errorMessageAlert(errorMessage);
              setIsLoading(false);
            },
          }
        );
      }

      // Sinon on créer un nouveau Contrat
      else {
        createContrat(values, {
          onSuccess: () => {
            successMessageAlert('Contrat Enregistrée avec succès');
            setIsLoading(false);
            resetForm();
            tog_form_modal();
          },
          onError: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Oh Oh ! une erreur est survenu lors de l'enregistrement";
            errorMessageAlert(errorMessage);
            setIsLoading(false);
          },
        });
      }
      setTimeout(() => {
        if (isLoading) {
          errorMessageAlert('Une erreur est survenue. Veuillez réessayer !');
          setIsLoading(false);
        }
      }, 10000);
    },
  });

  // utiliser useEffet pour sélectionner automatique la date de fin lorsqu'on choisi la date de début et la durée

  useEffect(() => {
    const selectedAppartement = validation.values.appartement;

    if (!selectedAppartement) return;
    const filterAppartement = secteurAppartement?.find(
      (value) =>
        value?._id === selectedAppartement &&
        value?.secteur?._id === secteurStorage?._id
    );

    if (!filterAppartement) return;
    const hValue = validation.values.heure || 0;
    const dayValue = validation.values.jour || 0;
    const weekValue = validation.values.semaine || 0;
    const mounthValue = validation.values.mois || 0;

    const heurePrice = Number((filterAppartement.heurePrice || 0) * hValue);
    const dayPrice = Number((filterAppartement.dayPrice || 0) * dayValue);
    const weekPrice = Number((filterAppartement.weekPrice || 0) * weekValue);
    const mounthPrice = Number(
      (filterAppartement.mounthPrice || 0) * mounthValue
    );

    const total = heurePrice + dayPrice + weekPrice + mounthPrice;
    const sumReduction = validation.values.reduction || 0;
    validation.setFieldValue('amount', Number(total));
    validation.setFieldValue('totalAmount', Number(total - sumReduction));

    // Calcul de la date de fin
    const startDate = validation.values.startDate;
    if (!startDate) return;
    const start = new Date(startDate);
    let end = new Date(start);
    end.setHours(end.getHours() + hValue);
    end.setDate(end.getDate() + dayValue + weekValue * 7 + mounthValue * 30);
    const endDateFormatted = end.toISOString().substring(0, 10);
    validation.setFieldValue('endDate', endDateFormatted);
  }, [
    appartment,
    validation.values.reduction,
    validation.values.appartement,
    validation.values.heure,
    validation.values.jour,
    validation.values.semaine,
    validation.values.mois,
    validation.values.startDate,
    validation.values.amount,
    validation.values.totalAmount,
    validation.values.reduction,
  ]);

  const date = new Date();

  return (
    <Form
      className='needs-validation'
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <h6 className='text-info text-end'>
        Total: {formatPrice(validation.values.amount || 0)}
        {' F '}
      </h6>
      <h6 className='text-success text-end'>
        Après remise: {formatPrice(validation.values.totalAmount || 0)} F{' '}
      </h6>
      <Row>
        {loadingAppart && <LoadingSpiner />}
        {!loadingAppart && errorAppart && secteurAppartement?.length === 0 && (
          <h6 className='text-center text-warning'>
            Aucun Appartement dans le Secteur {secteurStorage?.secteurNumber}
          </h6>
        )}
        {!loadingAppart && !errorAppart && secteurAppartement?.length > 0 && (
          <Col md='12'>
            <FormGroup className='mb-3'>
              <Label htmlFor='appartement'>N° d'Appartement</Label>
              <Input
                name='appartement'
                placeholder='appartement...'
                type='select'
                className='form-control border-1 border-dark'
                id='appartement'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.appartement || ''}
                invalid={
                  validation.touched.appartement &&
                  validation.errors.appartement
                    ? true
                    : false
                }
              >
                {contratToReload && (
                  <option value={contratToReload?.appartement?._id}>
                    {contratToReload?.appartement?.appartementNumber}{' '}
                  </option>
                )}

                {!contratToReload && !contratToEdit && (
                  <option value=''>Sélectionner un Appartement</option>
                )}

                {!contratToReload &&
                  secteurAppartement?.map((item) => (
                    <option value={item?._id} key={item?._id}>
                      {formatPrice(item.appartementNumber)}{' '}
                    </option>
                  ))}
              </Input>
              {validation.touched.appartement &&
              validation.errors.appartement ? (
                <FormFeedback type='invalid'>
                  {validation.errors.appartement}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
        )}
      </Row>
      <h6 className='my-3 text-info'>Duréer de Séjour</h6>
      <Row>
        <Col md='3'>
          <FormGroup className='mb-3'>
            <Label htmlFor='heure'>Heure</Label>
            <Input
              name='heure'
              placeholder='Heure...'
              type='number'
              min={0}
              className='form-control border-1 border-dark'
              id='heure'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.heure || ''}
              invalid={
                validation.touched.heure && validation.errors.heure
                  ? true
                  : false
              }
            />
            {validation.touched.heure && validation.errors.heure ? (
              <FormFeedback type='invalid'>
                {validation.errors.heure}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='3'>
          <FormGroup className='mb-3'>
            <Label htmlFor='jour'>Jour</Label>
            <Input
              name='jour'
              placeholder='Jour...'
              type='number'
              min={0}
              className='form-control border-1 border-dark'
              id='jour'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.jour || ''}
              invalid={
                validation.touched.jour && validation.errors.jour ? true : false
              }
            />
            {validation.touched.jour && validation.errors.jour ? (
              <FormFeedback type='invalid'>
                {validation.errors.jour}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='3'>
          <FormGroup className='mb-3'>
            <Label htmlFor='semaine'> Semaine</Label>
            <Input
              name='semaine'
              placeholder='Semaine...'
              type='number'
              min={0}
              className='form-control border-1 border-dark'
              id='semaine'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.semaine || ''}
              invalid={
                validation.touched.semaine && validation.errors.semaine
                  ? true
                  : false
              }
            />
            {validation.touched.semaine && validation.errors.semaine ? (
              <FormFeedback type='invalid'>
                {validation.errors.semaine}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='3'>
          <FormGroup className='mb-3'>
            <Label htmlFor='mois'>Mois</Label>
            <Input
              name='mois'
              placeholder='Mois...'
              type='number'
              min={0}
              className='form-control border-1 border-dark'
              id='mois'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.mois || ''}
              invalid={
                validation.touched.mois && validation.errors.mois ? true : false
              }
            />
            {validation.touched.mois && validation.errors.mois ? (
              <FormFeedback type='invalid'>
                {validation.errors.mois}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='startDate'>Date d'Entrée</Label>
            <Input
              name='startDate'
              placeholder="Entrez la date d'Entrée..."
              type='date'
              min={new Date().toISOString().substring(0, 10)}
              max={new Date(date.setDate(date.getDate() + 1))
                .toISOString()
                .substring(0, 10)}
              className='form-control border-1 border-dark'
              id='startDate'
              onChange={(e) => {
                validation.handleChange(e);
                if (validation.values.endDate < e.target.value) {
                  validation.setFieldValue('endDate', e.target.value);
                }
              }}
              onBlur={validation.handleBlur}
              value={validation.values.startDate}
              invalid={
                validation.touched.startDate && validation.errors.startDate
                  ? true
                  : false
              }
            />
            {validation.touched.startDate && validation.errors.startDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.startDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='endDate'>Date de Sortie</Label>
            <Input
              name='endDate'
              placeholder='Entrez La date de fin du contrat'
              type='date'
              min={
                validation.values.startDate ||
                new Date().toISOString().substring(0, 10)
              }
              className='form-control border-1 border-dark'
              id='endDate'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.endDate || ''}
              invalid={
                validation.touched.endDate && validation.errors.endDate
                  ? true
                  : false
              }
            />
            {validation.touched.endDate && validation.errors.endDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.endDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='amount'>Montant</Label>
            <Input
              name='amount'
              placeholder='Montant exacte du contrat...'
              type='number'
              min={0}
              className='form-control border-1 border-dark'
              id='amount'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.amount || undefined}
              invalid={
                validation.touched.amount && validation.errors.amount
                  ? true
                  : false
              }
            />
            {validation.touched.amount && validation.errors.amount ? (
              <FormFeedback type='invalid'>
                {validation.errors.amount}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='reduction'>Reduction / Remise</Label>
            <Input
              name='reduction'
              placeholder='Voudrais-vous faire une remise sur le prix...'
              type='number'
              min={0}
              max={validation.values.amount}
              className='form-control border-1 border-dark text-danger'
              id='reduction'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.reduction || undefined}
              invalid={
                validation.touched.reduction && validation.errors.reduction
                  ? true
                  : false
              }
            />
            {validation.touched.reduction && validation.errors.reduction ? (
              <FormFeedback type='invalid'>
                {validation.errors.reduction}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='comission'>Comission</Label>
            <Input
              name='comission'
              placeholder='Entrez la comission sur le contrat...'
              type='number'
              min={0}
              max={validation.values.totalAmount}
              className='form-control border-1 border-dark'
              id='comission'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.comission || undefined}
              invalid={
                validation.touched.comission && validation.errors.comission
                  ? true
                  : false
              }
            />
            {validation.touched.comission && validation.errors.comission ? (
              <FormFeedback type='invalid'>
                {validation.errors.comission}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <div className='d-grid text-center mt-4'>
        {isLoading && <LoadingSpiner />}
        {!isLoading && (
          <Button color='success' type='submit'>
            Enregisrer
          </Button>
        )}
      </div>
    </Form>
  );
};

export default ContratForm;

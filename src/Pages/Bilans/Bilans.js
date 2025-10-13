import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { useAllPaiements } from '../../Api/queriesPaiement';
import { useAllDepenses } from '../../Api/queriesDepense';
import DepenseBilans from './DepenseBilans';
import PaiementBilans from './PaiementBilans';
export default function Bilans() {
  const [bodyContent, setBodyContent] = useState('paiement');

  const body = useMemo(() => {
    if (bodyContent === 'paiement') {
      return <PaiementBilans />;
    } else if (bodyContent === 'depense') {
      return <DepenseBilans />;
    }
  }, [bodyContent]);

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Rapport' breadcrumbItem='Bilans' />
          <div className='d-flex justify-content-center gap-3 align-items-center mb-2'>
            <Button
              color='danger'
              className={`
              
              ${
                bodyContent === 'depense' ? 'border-3 border-light' : 'border-0'
              }
              `}
              onClick={() => setBodyContent('depense')}
            >
              Dépense
              <i className='dripicons-arrow-thin-down'></i>
            </Button>
            <Button
              color='success'
              className={`
              
              ${
                bodyContent === 'paiement'
                  ? 'border-3 border-light'
                  : 'border-0'
              }
              `}
              onClick={() => setBodyContent('paiement')}
            >
              Paiement
              <i className='dripicons-arrow-thin-up'></i>
            </Button>
          </div>

          {body}
        </Container>
      </div>
    </React.Fragment>
  );
}

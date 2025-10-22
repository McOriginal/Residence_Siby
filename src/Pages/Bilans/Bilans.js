import React, { useMemo, useState } from 'react';
import { Button, Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
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

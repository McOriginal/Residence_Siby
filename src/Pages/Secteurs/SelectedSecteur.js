import { Button, Container } from 'reactstrap';
import AppartementListe from '../Appartements/AppartementListe';
import SecteurContrat from './SecteurContrat';
import React from 'react';
import ContratPaiements from './ContratPaiements';
import BackButton from '../components/BackButton';
import { useNavigate } from 'react-router-dom';

export default function SelectedSecteur() {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <div className='page-content bg-primary'>
        <Container fluid={true}>
          <div className='d-flex justify-content-center align-items-center gap-4'>
            <BackButton />
            <Button color='dark' onClick={() => navigate('/dashboard')}>
              Tableau de Bord
            </Button>
          </div>
          <div style={{ height: '400px' }}>
            <AppartementListe />
          </div>

          <div style={{ height: '400px', margin: '10% 0' }}>
            <SecteurContrat />
          </div>

          <div style={{ height: '400px', margin: '10% 0' }}>
            <ContratPaiements />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

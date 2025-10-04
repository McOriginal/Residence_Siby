import { Button, Container } from 'reactstrap';
import AppartementListe from '../Appartements/AppartementListe';
import SecteurContrat from './SecteurContrat';
import React from 'react';
import ContratPaiements from './ContratPaiements';
import { useNavigate } from 'react-router-dom';
import {
  BackButton,
  DashboardButton,
  HomeButton,
} from '../components/NavigationButton';

export default function SelectedSecteur() {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <div className='page-content bg-primary'>
        <Container fluid={true}>
          <div className='d-flex justify-content-center align-items-center gap-4'>
            <BackButton />
            <DashboardButton />
            <HomeButton />
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

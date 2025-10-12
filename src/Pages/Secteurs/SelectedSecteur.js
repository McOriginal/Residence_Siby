import { Button, Col, Container, Row } from 'reactstrap';
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
import SecteurReservationListe from './SecteurReservationListe';

export default function SelectedSecteur() {
  return (
    <React.Fragment>
      <div className='page-content bg-light'>
        <Container fluid={true}>
          <div className='d-flex justify-content-center align-items-center gap-4'>
            <BackButton />
            <DashboardButton />
            <HomeButton />
          </div>
          <Row>
            <Col sm={12} style={{ height: '700px' }}>
              <AppartementListe />
            </Col>

            <Col sm={12} style={{ height: '400px', margin: '10% 0' }}>
              <SecteurContrat />
            </Col>

            <Col sm={12} style={{ height: '400px', margin: '10% 0' }}>
              <SecteurReservationListe />
            </Col>

            <Col sm={12} style={{ height: '400px', margin: '10% 0' }}>
              <ContratPaiements />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

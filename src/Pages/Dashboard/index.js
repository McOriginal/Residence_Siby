import React from 'react';
import { motion } from 'framer-motion';

import { Row, Container, Col } from 'reactstrap';
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { companyName } from '../CompanyInfo/CompanyInfo';
import {
  TotalSecteur,
  TotalAppartement,
  TotalClient,
  TotalContrat,
} from './Total_Items';

const Dashboard = () => {
  document.title = `Tableau de Bord | ${companyName} `;

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid={true}>
          <Breadcrumbs
            title='Administrateur'
            breadcrumbItem='Tabelau de Bord'
          />

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Row>
              <Col sm={3} md={6}>
                <TotalSecteur />
              </Col>

              <Col sm={3} md={6}>
                <TotalAppartement />
              </Col>

              <Col sm={3} md={6}>
                <TotalClient />
              </Col>

              <Col sm={3} md={6}>
                <TotalContrat />
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;

import { Card } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import { useNavigate } from 'react-router-dom';
import { useAllSecteur } from '../../Api/queriesSecteurs';
import { useAllAppartement } from '../../Api/queriesAppartement';
import { useAllClient } from '../../Api/queriesClient';
import { useAllContrat } from '../../Api/queriesContrat';

const TotalSecteur = () => {
  const {
    data: secteurs,
    isLoading: loadingSecteur,
    error: errorSecteur,
  } = useAllSecteur();

  const navigate = useNavigate();

  const handleNavigate = () => {
    return navigate('/home');
  };

  return (
    <div onClick={() => handleNavigate()} style={{ cursor: 'pointer' }}>
      {loadingSecteur && <LoadingSpiner />}
      {!errorSecteur && !loadingSecteur && (
        <Card
          style={{
            height: '180px',
            border: '1px solid #023047',
            boxShadow: '1px 0px 10px rgba(2, 5, 116, 0.32)',
          }}
          className='d-flex gap-3  flex-column justify-content-center align-items-center'
        >
          <i
            className=' fas fa-bezier-curve text-info'
            style={{ fontSize: '50px' }}
          ></i>

          <h3 className='text-info'>{secteurs?.length}</h3>
          <h5>Secteurs</h5>
        </Card>
      )}
    </div>
  );
};

const TotalAppartement = () => {
  const { data: appartement, isLoading: loading, error } = useAllAppartement();

  return (
    <div>
      {loading && <LoadingSpiner />}
      {!error && !loading && (
        <Card
          style={{
            height: '180px',
            border: '1px solid #023047',
            boxShadow: '1px 0px 10px rgba(2, 5, 116, 0.32)',
          }}
          className='d-flex gap-3  flex-column justify-content-center align-items-center'
        >
          <i
            className=' fas fa-home text-info'
            style={{ fontSize: '50px' }}
          ></i>

          <h3 className='text-info'>{appartement?.length}</h3>
          <h5>Appartements</h5>
        </Card>
      )}
    </div>
  );
};

const TotalClient = () => {
  const { data: clients, isLoading: loading, error } = useAllClient();
  const navigate = useNavigate();

  return (
    <div style={{ cursor: 'pointer' }} onClick={() => navigate('/clients')}>
      {loading && <LoadingSpiner />}
      {!error && !loading && (
        <Card
          style={{
            height: '180px',
            border: '1px solid #023047',
            boxShadow: '1px 0px 10px rgba(2, 5, 116, 0.32)',
          }}
          className='d-flex gap-3  flex-column justify-content-center align-items-center'
        >
          <i
            className=' fas fa-users text-info'
            style={{ fontSize: '50px' }}
          ></i>

          <h3 className='text-info'>{clients?.length}</h3>
          <h5>Clients</h5>
        </Card>
      )}
    </div>
  );
};

const TotalContrat = () => {
  const { data: contrat, isLoading: loading, error } = useAllContrat();
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate('/contrats')} style={{ cursor: 'pointer' }}>
      {loading && <LoadingSpiner />}
      {!error && !loading && (
        <Card
          style={{
            height: '180px',
            border: '1px solid #023047',
            boxShadow: '1px 0px 10px rgba(2, 5, 116, 0.32)',
          }}
          className='d-flex gap-3  flex-column justify-content-center align-items-center'
        >
          <i
            className='  fas fa-receipt text-info'
            style={{ fontSize: '50px' }}
          ></i>

          <h3 className='text-info'>{contrat?.length}</h3>
          <h5>Contrats</h5>
        </Card>
      )}
    </div>
  );
};

export { TotalSecteur, TotalAppartement, TotalClient, TotalContrat };

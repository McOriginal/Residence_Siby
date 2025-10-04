import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button color='warning' className='my-2' onClick={() => navigate(-1)}>
      <i className='bx bx-arrow-back me-1' />
      Retour
    </Button>
  );
};

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      color='info'
      className='my-2 text-light'
      onClick={() => navigate('/home')}
    >
      <i className='bx bx-home me-1' />
      Accueil
    </Button>
  );
};

const DashboardButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      color='dark'
      className='my-2 text-light'
      onClick={() => navigate('/dashboard')}
    >
      <i className='fas fa-server me-1' />
      Tableau de Bord
    </Button>
  );
};

export { BackButton, HomeButton, DashboardButton };

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InitialPage.css'; // Assurez-vous de créer ce fichier pour les styles
import { companyLogo, companyServices2 } from '../CompanyInfo/CompanyInfo';

const InitialPage = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false);
      navigate('/home');
    }, 9000);

    return () => clearTimeout(timer); // Nettoyage du timer
  }, [navigate]);

  return (
    <div className='initial-page'>
      {showText && (
        <div className='container'>
          <img src={companyLogo} alt='Logo' className='init_img' />
          <h2 className='welcome-text'>Bienvenue sur Residence Siby</h2>
          <p className='service'>{companyServices2} </p>
        </div>
      )}
    </div>
  );
};

// lorsqu'on se connecte je veux une animation de texte "Bienvenue sur Residence Siby" qui s'affiche pendant 5s ensuite on faire une redirection automatique vers "/home"
export default InitialPage;

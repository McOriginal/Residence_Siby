export default function ActiveSecteur() {
  const selectedSecteur = localStorage.getItem('selectedSecteur');
  const secteur = JSON.parse(selectedSecteur);

  return (
    <div
      className='mx-auto mt-4 text-light bg-dark px-3 py-2 border-1 border-light rounded'
      style={{ width: '200px' }}
    >
      <h4 className='text-light text-center'>
        {secteur ? secteur.adresse : 'Aucun Secteur'}
      </h4>
    </div>
  );
}

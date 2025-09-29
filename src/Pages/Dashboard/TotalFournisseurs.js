// import { Card, CardBody, CardImg, CardTitle } from 'reactstrap';
// import { useAllFournisseur } from '../../Api/queriesFournisseur';
// import fourImg from './../../assets/images/delivery.png';
// import LoadingSpiner from '../components/LoadingSpiner';
// import { useNavigate } from 'react-router-dom';
// import { connectedUserRole } from '../Authentication/userInfos';

// export default function TotalFounisseurs() {
//   // Fournisseur Data
//   const {
//     data: fournisseurData,
//     isLoading: fournisseurLoading,
//     error: fournisseurError,
//   } = useAllFournisseur();
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     return navigate('/fournisseurs');
//   };
//   return (
//     <div
//       onClick={() => connectedUserRole === 'admin' && handleNavigate()}
//       style={{ cursor: 'pointer' }}
//     >
//       {fournisseurLoading && <LoadingSpiner />}
//       {!fournisseurError && !fournisseurLoading && (
//         <Card
//           style={{
//             height: '180px',
//             boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
//           }}
//         >
//           <CardImg
//             src={fourImg}
//             alt='Fournisseurs'
//             style={{ height: '90px', objectFit: 'contain' }}
//           />
//           <CardBody>
//             <CardTitle className='text-center'>
//               <span className='text-info fs-5'>{fournisseurData.length}</span>
//               <p>Fournisseurs</p>
//             </CardTitle>
//           </CardBody>
//         </Card>
//       )}
//     </div>
//   );
// }

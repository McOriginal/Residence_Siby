import React from 'react';
import { Navigate } from 'react-router-dom';

//Dashboard
import Dashboard from '../Pages/Dashboard';

// Import Authentication pages
import Login from '../Pages/Authentication/Login';
import ForgetPasswordPage from '../Pages/Authentication/ForgetPassword';
import Register from '../Pages/Authentication/Register';
import UserProfile from '../Pages/Authentication/user-profile';

// Importing other pages
import PaiementsListe from '../Pages/Paiements/PaiementsListe.js';
import DepenseListe from '../Pages/Depenses/DepenseListe.js';
import UpdatePassword from '../Pages/Authentication/UpdatePassword.js';

import ResetPassword from '../Pages/Authentication/ResetPassword.js';

import PaiementsHistorique from '../Pages/Commandes/PaiementsHistorique/PaiementsHistorique.js';

import UsersProfilesListe from '../Pages/Authentication/UsersProfilesListe.js';
import ProfileDetail from '../Pages/Authentication/ProfileDetail.js';
import Bilans from '../Pages/Bilans/Bilans.js';
import Secteur from '../Pages/Secteurs/Secteur.js';
import AppartementListe from '../Pages/Appartements/AppartementListe.js';
import ClientListe from '../Pages/Client/FournisseurListe.js';

const sharedRoutes = [
  // Paiements Liste
  { path: '/paiements', component: <PaiementsListe /> },

  // Changer le mot de passe
  { path: '/updatePassword', component: <UpdatePassword /> },
];

// Routes pour les ADMINS
const authProtectedRoutes = [
  //dashboard
  { path: '/dashboard', component: <Dashboard /> },

  {
    path: '/',
    exact: true,
    component: <Navigate to='/dashboard' />,
  },

  { path: '/secteurs', component: <Secteur /> },

  { path: '/secteur/:id', component: <AppartementListe /> },

  { path: '/clients', component: <ClientListe /> },

  // Historique Paiement
  { path: '/paiements_historique/:id', component: <PaiementsHistorique /> },

  // Dépenses
  { path: '/depenses', component: <DepenseListe /> },

  // Profile
  { path: '/userprofile', component: <UserProfile /> },

  // Details du Profile
  { path: '/userProfileDetails/:id', component: <ProfileDetail /> },

  // Modifier un Profile
  { path: '/updateUser/:id', component: <UserProfile /> },

  // Liste des Utilisateurs
  { path: '/usersProfileListe', component: <UsersProfilesListe /> },

  // Raports & Bilans
  { path: '/bilans', component: <Bilans /> },

  { path: '/register', component: <Register /> },
  // --------------------------------------------------------
];

// Routes pour les Médecins
const usersRoutes = [
  {
    path: '/',
    exact: true,
    component: <Navigate to='/dashboard-user' />,
  },
  //dashboard
  { path: '/dashboard-user', component: <Dashboard /> },
  // Profile
  { path: '/userprofile', component: <UserProfile /> },
];

const publicRoutes = [
  // { path: '/unauthorized', component: <Unauthorized /> },

  // Authentication Page
  { path: '/register', component: <Register /> },
  { path: '/login', component: <Login /> },
  { path: '/forgotPassword', component: <ForgetPasswordPage /> },
  { path: '/resetPassword', component: <ResetPassword /> },
];

export { authProtectedRoutes, usersRoutes, publicRoutes, sharedRoutes };

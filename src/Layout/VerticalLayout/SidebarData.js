const SidebarData = [
  {
    label: 'Menu',
    isMainMenu: true,
  },
  {
    label: 'Tableau De Bord',
    icon: 'mdi mdi-home-variant-outline',
    isHasArrow: true,
    url: '/dashboard',
  },
  {
    label: 'Client',
    icon: 'fas fa-user',
    isHasArrow: true,
    url: '/clients',
  },
  {
    label: 'Contrat',
    icon: 'fas fa-file',
    isHasArrow: true,
    url: '/contrats',
  },

  // --------------------------------------

  // Transactions / Comptabilité
  {
    label: 'Caisse & Comptabilité',
    isMainMenu: true,
  },
  {
    label: 'Paiements / Entrée',
    icon: 'fas fa-dollar-sign',
    isHasArrow: true,
    url: '/paiements',
  },
  {
    label: 'Depense / Sortie',
    icon: 'fas fa-euro-sign',
    isHasArrow: true,
    url: '/depenses',
  },

  {
    label: 'Rapports & Bilans',
    isMainMenu: true,
  },
  {
    label: 'Bilans',
    icon: 'fas fa-balance-scale',
    isHasArrow: true,
    url: '/bilans',
  },
  {
    label: 'Rapports et Suivie',
    icon: 'fas fa-chart-bar',
    isHasArrow: true,
    url: '/rapports',
  },

  // --------------------------------------
];
export default SidebarData;

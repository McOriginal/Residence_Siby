const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

const clientController = require('../controller/ClientController');

// Créer un Fournisseur
router.post(
  '/createClient',
  userController.authMiddleware,
  clientController.createClient
);

// Afficher toutes les Clients
router.get('/getAllClients', clientController.getAllClients);

// Afficher un seul Client
router.get('/getClient/:id', clientController.getClient);

// Mettre à jour un Client
router.put('/updateClient/:id', clientController.updateClient);

// supprimer un Client
router.delete(
  '/deleteClient/:id',
  clientController.deleteClient
);

// Supprimer toutes les Client
router.delete(
  '/deleteAllClient',
  clientController.deleteAllClients
);

module.exports = router;

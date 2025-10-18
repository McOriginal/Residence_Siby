const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

const rentalController = require('../controller/RentalController');

// Créer un Rental
router.post(
  '/createRental',
  userController.authMiddleware,
  rentalController.createRental
);

// Afficher toutes les Rentals
router.get('/getAllRentals', rentalController.getAllRental);

// Afficher un seul Rental
router.get('/getRental/:id', rentalController.getRental);

// Mettre à jour un Rental
router.put('/updateRental/:id', rentalController.updateRental);


router.put('/updateRentalStatut/:id', rentalController.updateRentalStatut);

// supprimer un Rental
router.delete(
  '/deleteRental/:id',
  rentalController.deleteRental
);



module.exports = router;

const mongoose = require('mongoose');
const Rental = require('../models/RentalModel')
const Contrat = require('../models/ContratModel');
const Appartement = require('../models/AppartementModel');
const textValidation = require('./regexValidation');

// Ajouter un Rental
exports.createRental = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

const reservationDate =new Date(req.body.rentalDate);
const reservationEndDate =new Date(req.body.rentalEndDate);


    const existingContrat = await Contrat.findOne({
      appartement: req.body.appartement,
   $or:[
    {
      startDate: { $lte: reservationEndDate},
    endDate: {$gte: reservationDate},
  }
   ]
    }).session(session)
 
    
    if(existingContrat){
      await   session.abortTransaction()
      session.endSession()
      return res.status(400).json({message: `Un Contrat serai en cours du: ${new Date(existingContrat.startDate).toLocaleDateString('fr-Fr')} au ${new Date(existingContrat.endDate).toLocaleDateString('fr-Fr')}`})
    }

    const existingRental = await Rental.findOne({
      appartement: req.body.appartement,
      $or:[
        {
          rentalDate: { $lte:reservationEndDate},
          rentalEndDate: {$gte: reservationDate},
        }
      ]
    }).session(session);


    if(existingRental){
      await   session.abortTransaction()
      session.endSession()
      return res.status(400).json({message: `Cette Appartement est reservée du: ${new Date(existingRental.rentalDate).toLocaleDateString('fr-Fr')} au  ${new Date(existingRental.rentalEndDate).toLocaleDateString('fr-Fr')}`})
    }

      const newRental = await Rental.create(
        [{
      
      user: req.user.id,
      ...req.body,
    }],
    {session},
  );
     
 
    await session.commitTransaction()
    session.endSession()
    return res.status(201).json(newRental);
  } catch (e) {
    console.log(e)
   await session.abortTransaction()
    session.endSession()
    return res.status(409).json({
      status: 'Erreur',
      message: e.message,
    });
    
  }
};

// Mettre à jour un Rental

exports.updateRental = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
   
const reservationDate =new Date(req.body.rentalDate);
const reservationEndDate =new Date(req.body.rentalEndDate);


// ----------------------------------------------
// ---------- CONTRAT
// ----------------------------------------------

    const existingContrat = await Contrat.findOne({
      appartement: req.body.appartement,
   $or:[
    {
      startDate: { $lte: reservationEndDate},
    endDate: {$gte: reservationDate},
  }
   ]
    }).session(session)
 
    
    if(existingContrat){
      await   session.abortTransaction()
      session.endSession()
      return res.status(400).json({message: `Un Contrat serai en cours du: ${new Date(existingContrat.startDate).toLocaleDateString('fr-Fr')} au ${new Date(existingContrat.endDate).toLocaleDateString('fr-Fr')}`})
    }


    
// ----------------------------------------------
// ---------- RENTAL
// ----------------------------------------------
    const existingRental = await Rental.findOne({
      _id: {$ne: req.params.id},
      appartement: req.body.appartement,
      $or:[
        {
          rentalDate: { $lte:reservationEndDate},
          rentalEndDate: {$gte: reservationDate},
        }
      ]
    }).session(session);


    if(existingRental){
      await   session.abortTransaction()
      session.endSession()
      return res.status(400).json({message: `Cette Appartement est reservée du: ${new Date(existingRental.rentalDate).toLocaleDateString('fr-Fr')} au  ${new Date(existingRental.rentalEndDate).toLocaleDateString('fr-Fr')}`})
    }



    // Mise à jour LA RESERVATION
    const result = await Rental.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
        context: "query",
        session,
      }
    );


    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(result);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(400).json({ status: "error", message: err.message });
  }
};




// Obtenir tous les Rental
exports.getAllRental = async (req, res) => {
 
  try {
    const result = await Rental.find()
    .populate('client')
      .populate({path:'appartement', populate:{path: 'secteur'}})
      .populate('user')
      .sort({ rentalDate: -1 })
  
    return res.status(200).json(result);
  } catch (error) {
   console.log(error)
    return res.status(404).json({ message: error });
  }
};

// Récupérer un Rental
exports.getRental = async (req, res) => {
  try {
    const result = await Rental.findById(req.params.id)
    .populate('client')
    .populate({path:'appartement', populate:{path: 'secteur'}})
    .populate('user');
    res.status(200).json(result);


  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un Rental
exports.deleteRental = async (req, res) => {
  try {
    
  await Rental.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ status: 'success', message: 'Reservation supprimé avec succès' });


  } catch (err) {
  console.log(err)
    return res.status(400).json({ status: 'error', message: err.message });
  }
};


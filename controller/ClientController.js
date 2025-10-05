const mongoose = require('mongoose');
const Client = require('../models/ClientModel');
const Contrat = require('../models/ContratModel');
const Paiement = require('../models/PaiementModel')
const Appartement = require('../models/AppartementModel')
const textValidation = require('./regexValidation');

// Créer un Fournisseur
exports.createClient = async (req, res) => {
  try {
    const { firstName, lastName, ...resOfData } =
      req.body;
    // Changer les données en miniscule
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();

    if (
      !textValidation.stringValidator(lowerFirstName) ||
      !textValidation.stringValidator(lowerLastName) 
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Vous avez mal saisie les données',
      });
    }

    // Crée un nouveau professeur
    const newClient = await Client.create({
      firstName: lowerFirstName,
      lastName: lowerLastName,
      user: req.user.id,
      ...resOfData,
    });
    return res.status(201).json(newClient);
  } catch (e) {
    return res.status(409).json({
      status: 'Email existe',
      message: e.message,
    });
    // }
  }
};

// Mettre à jour un Client
exports.updateClient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
     
      ...resOfData
    } = req.body;
    // Changer les données en miniscule
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    
    if (
      !textValidation.stringValidator(lowerFirstName) ||
      !textValidation.stringValidator(lowerLastName)     ) {
      return res.status(400).json({
        status: 'error',
        message: 'Vous avez mal saisie les données',
      });
    }

    //  Si il n y a pas d'erreur on met ajour
    const updated = await Client.findByIdAndUpdate(
      req.params.id,
      {
        firstName: lowerFirstName,
        lastName: lowerLastName,
    
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );
  
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Obtenir tous les Clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate('user')
      .sort({ createdAt: -1 });
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

// Récupérer un Client par ID
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
    .populate('user');
    if (!client)
      return res
        .status(404)
        .json({ status: 'error', message: 'Client non trouvé' });

    res.status(200).json(client);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un Client
exports.deleteClient = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction();
  try {

    // Avant de Supprimer le CLIENT on vérrifie si il n'y pas des CONTRATS lié à ce CLIENT
    const clientContrat = await Contrat.find({client:req.params.id}).session(session);

    if(clientContrat){
    
    // SI il y'a des CONTRAT alors on Supprime tous les CONTRAT liés
    for(const cont of clientContrat){

      // On Vérifie dans la boucle si il n'y a pas des PAIEMENTS liés aux CONTRATS
      const clientPaiem = await Paiement.find({contrat:cont._id}).session(session)
      if(clientPaiem){
      // Si ce le cas alors on supprimer tous les PAIEMENTS liés
for(const paie of clientPaiem){
  await Paiement.findByIdAndDelete(paie._id,{session})
}
      }
    }


// On met à jours la disponibilité de tous les APPARTEMENTS  lié aux CONTRAT
const apparts = await Appartement.find({_id: cont.appartement}).session(session);


for (const app of apparts){
  await Appartement.findByIdAndUpdate(app._id,{isAvailable:true},{session})
}


// ensuite on supprime le CONTRAT
await Contrat.findByIdAndDelete(cont._id,{session});

}

// Et pour finir on supprime le CLIENT
    await Client.findByIdAndDelete(req.params.id, {session});

await session.commitTransaction();
session.endSession()

    return res
      .status(200)
      .json({ status: 'success', message: 'Client supprimé avec succès' });
  } catch (err) {
    session.abortTransaction()
    session.endSession()
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// ############### DELETE ALL STUDENTS ############################
exports.deleteAllClients = async (req, res) => {
  try {
    await Client.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Tous les Clients ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression des Clients',
      error: e.message,
    });
  }
};

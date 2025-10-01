const mongoose = require('mongoose');
const Client = require('../models/ClientModel');
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
  try {
    await Client.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Client supprimé avec succès' });
  } catch (err) {
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

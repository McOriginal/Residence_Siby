const mongoose = require('mongoose');
const Contrat = require('../models/ContratModel');
const textValidation = require('./regexValidation');
const { populate } = require('../models/PaiementModel');

// Ajouter un Contrat
exports.createContrat = async (req, res) => {
  try {
      const newContrat = await Contrat.create({
      
      user: req.user.id,
      ...req.body,
    });
    return res.status(201).json(newContrat);
  } catch (e) {
    return res.status(409).json({
      status: 'Erreur',
      message: e.message,
    });
    
  }
};

// Mettre à jour un Contrat
exports.updateContrat = async (req, res) => {
  try {
   
    //  Si il n y a pas d'erreur on met ajour
    const updated = await Contrat.findByIdAndUpdate(
      req.params.id,
      {
       
    
        ...req.body,
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

// Obtenir tous les Contrat
exports.getAllContrat = async (req, res) => {
  try {
    const contrat = await Contrat.find()
    .populate('client')
      .populate('appartement')
      .populate({path:'appartement', populate:'secteur'})
      .populate('user')
      .sort({ createdAt: -1 });
    return res.status(200).json(contrat);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

// Récupérer un Contrat
exports.getContrat = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id)
    .populate('client')
    .populate('appartement')
      .populate({path:'appartement', populate:'secteur'})
    .populate('user');
    if (!contrat)
      return res
        .status(404)
        .json({ status: 'error', message: 'contrat non trouvé' });

    res.status(200).json(contrat);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un Contrat
exports.deleteContrat = async (req, res) => {
  try {
    await Contrat.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Contrat supprimé avec succès' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// ############### DELETE ALL STUDENTS ############################
exports.deleteAllContrats = async (req, res) => {
  try {
    await Contrat.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Tous les Contrat ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression des Clients',
      error: e.message,
    });
  }
};

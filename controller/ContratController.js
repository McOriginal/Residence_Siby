const mongoose = require('mongoose');
const Contrat = require('../models/ContratModel');
const Appartement = require('../models/AppartementModel');
const Paiement = require('../models/PaiementModel')
const textValidation = require('./regexValidation');

// Ajouter un Contrat
exports.createContrat = async (req, res) => {
  try {

    const appartement = await Appartement.findById(req.body.appartement)

 
    if(appartement.isAvailable === false){
      return res.status(400).json({message: "Cet Appartement n'est pas disponible"})
    }

      const newContrat = await Contrat.create({
      
      user: req.user.id,
      ...req.body,
    });
     // Mettre l'appartement en indisponible
     await Appartement.findByIdAndUpdate(
      appartement,
      { isAvailable: false },
      { new: true }
    );
 
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldContrat = await Contrat.findById(req.params.id).session(session);
    if (!oldContrat) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Contrat non trouvé" });
    }

    const appartement = await Appartement.findById(req.body.appartement).session(session);
    if (!appartement) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Appartement non trouvé" });
    }

    // Vérification si changement d'appartement et que le nouvel appart est indisponible
    if (
      req.body.appartement !== oldContrat.appartement.toString() &&
      appartement.isAvailable === false
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Cet Appartement n'est pas disponible" });
    }

    // Mise à jour du contrat
    const updated = await Contrat.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
        context: "query",
        session,
      }
    );

    // 🔑 Si l'appartement a changé => libérer l'ancien
    if (req.body.appartement !== oldContrat.appartement.toString()) {
      await Appartement.findByIdAndUpdate(
        oldContrat.appartement,
        { isAvailable: true },
        { session }
      );
    }

    // Met à jour la dispo du nouvel appart
    if (new Date(updated.endDate) > new Date()) {
      // contrat actif => appart occupé
      await Appartement.findByIdAndUpdate(
        updated.appartement,
        { isAvailable: false },
        { session }
      );
    } else {
      // contrat expiré => appart dispo
      await Appartement.findByIdAndUpdate(
        updated.appartement,
        { isAvailable: true },
        { session }
      );
    }

    // ✅ Commit la transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(updated);
  } catch (err) {
    // ❌ Rollback en cas d'erreur
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(400).json({ status: "error", message: err.message });
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
    const session = await mongoose.startSession()
    session.startTransaction();
  const contrat=  await Contrat.findByIdAndDelete(req.params.id,{session});

    await Appartement.findByIdAndUpdate(
     contrat.appartement._id,
      { isAvailable: true },
      { new: true ,session}
    );
const paiements = await Paiement.find().session(session);

if(paiements){
    for(const pai of paiements){
      await Paiement.findByIdAndDelete(pai._id,{session});
    }
    }

await session.commitTransaction();
session.endSession();
    return res
      .status(200)
      .json({ status: 'success', message: 'Contrat supprimé avec succès' });
  } catch (err) {
    session.abortTransaction();
    session.endSession();
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

const mongoose = require('mongoose');
const Secteur = require('../models/SecteurModel');
const textValidation = require('./regexValidation');

// Créer un Fournisseur
exports.createSecteur = async (req, res) => {
  try {
    const {secteurNumber} = req.body;

    // Vérification des champs uniques
    const existingSecteur = await Secteur.findOne({
      secteurNumber
    }).exec();

    if ( existingSecteur) {
      
      return res.status(409).json({
        status: 'error',
        message: (`Le Secteur ${secteurNumber} existe déjà`),
      });
    }

    // Crée un nouveau 
    const newSecteur = await Secteur.create({
      
      user: req.user.id,
      ...req.body,
    });
    return res.status(201).json(newSecteur);
  } catch (e) {
    return res.status(409).json({
      message: e.message,
    });
    // }
  }
};

// Mettre à jour un Secteur
exports.updateSecteur = async (req, res) => {
  try {
    const {
     
      secteurNumber
    } = req.body;
   
    // Vérification des doublons (en excluant l'Secteur actuel)
    const existingSecteur = await Secteur.findOne({
      _id: { $ne: req.params.id }, // Exclure l'Secteur actuel
secteurNumber,    }).exec();

    if (existingSecteur) {
    

      return res.status(409).json({
        message: `Le Secteur: ${existingSecteur.secteurNumber} existe déjà`,
      });
    }

    
    //  Si il n y a pas d'erreur on met ajour
    const updated = await Secteur.findByIdAndUpdate(
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
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Secteur non trouvé',
      });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Obtenir tous les Secteurs
exports.getAllSecteurs = async (req, res) => {
  try {
    const secteurs = await Secteur.find()
      .populate('user')
      .sort({ secteurNumber: 1 });
    return res.status(200).json(secteurs);
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Récupérer un Secteur par ID
exports.getSecteur = async (req, res) => {
  try {
    const secteur = await Secteur.findById(req.params.id)
    .populate(
      'user'
    );
    if (!secteur)
      return res
        .status(404)
        .json({ status: 'error', message: 'Secteur non trouvé' });

    res.status(200).json(secteur);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un Secteur
exports.deleteSecteur = async (req, res) => {
  try {
    await Secteur.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Secteur supprimé avec succès' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// ############### DELETE ALL STUDENTS ############################
exports.deleteAllSecteurs = async (req, res) => {
  try {
    await Secteur.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Tous les Secteurs ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression des Secteurs',
      error: e.message,
    });
  }
};

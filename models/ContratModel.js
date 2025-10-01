const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema(
  {
   

    heure: {
      type: Number,
      default: 0,
      trim: true,
    },
    jour: {
      type: Number,
      default: 0,
      trim: true,
    },
    semaine: {
      type: Number,
      default: 0,
      trim: true,
    },
    mois: {
      type: Number,
      default: 0,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
      default: new Date(),
      trim: true,
    },
    endDate: {
      type: Date,
      required: true,
      time: true
    },
    totalAmount: {
      type: Number,
      required: true,
      time: true
    },
    
    // document: {
    //   type: File,
    //   required: true,
    // },
    appartement: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appartement',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Contrat = mongoose.model('Contrat', contratSchema);

module.exports = Contrat;

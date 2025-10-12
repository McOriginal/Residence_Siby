const mongoose = require('mongoose');

const appartementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    appartementNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    heurePrice: {
      type: Number,
      required: true,
      default: 0,
      trim: true,
    },
    dayPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    weekPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    mounthPrice: {
      type: Number,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
      trim: true,
    },
    etat: {
      type: Boolean,
      default: true,
      trim: true,
      required: true,
    },
    
    secteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Secteur',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Appartement = mongoose.model('Appartement', appartementSchema);

module.exports = Appartement;

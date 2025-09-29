const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    duration: {
      type: String,
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
    
    // document: {
    //   type: File,
    //   required: true,
    // },
    appartement: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appartement',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Fournisseur = mongoose.model('Fournisseur', clientSchema);

module.exports = Fournisseur;

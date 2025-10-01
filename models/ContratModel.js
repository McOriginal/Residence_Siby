const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema(
  {
   

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

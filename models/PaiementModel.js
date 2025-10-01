const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema(
  {
   
    totalPaye: {
      type: Number,
      required: true,
      trim: true,
    },
    reduction: {
      type: Number,
      default: 0,
    },

    paiementDate: {
      type: Date,
      required: true,
    },
    
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    contrat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contrat',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Paiement = mongoose.model('Paiement', paiementSchema);
module.exports = Paiement;

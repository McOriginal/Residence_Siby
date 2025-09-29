const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema(
  {
    totalAmount: {
      type: Number,
      required: true,
      trim: true,
    },
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

const mongoose = require('mongoose');

const secteurSchema = new mongoose.Schema(
  {
    secteurNumber: {
      type: Number,
      required: true,
    },

    adresse: {
      type: String,
      required: true,
      max: 30,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Secteur = mongoose.model('Secteur', secteurSchema);

module.exports = Secteur;

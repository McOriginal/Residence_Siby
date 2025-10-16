const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    client : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        require: true,
    },
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
    rentalDate: {
        type: Date,
        required: true,
        trim: true,
    },
    rentalEndDate: {
        type: Date,
        required: true,
        trim: true,
    },
    totalPaye: {
        type: Number,
        required: true,
        trim: true,
    },
    
appartement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appartement',
    required: true,
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},

},
{timestamps:true}
);


const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental
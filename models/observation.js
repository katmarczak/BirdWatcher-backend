const mongoose = require('mongoose');
const { speciesSchema } = require('./species');

const Observation = mongoose.model('Observation', new mongoose.Schema({
    owner: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        username: { type: String, required: true }
    },
    species: { 
        type: speciesSchema, 
        required: true 
    },
    date: Date,
    exactLocation: { 
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: { // longitude, latitude
            type: [Number],
            required: false
        }
    },
    town: String,
    visible: { type: Boolean, default: true },
    description: String
}));

module.exports.Observation = Observation;
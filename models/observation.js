const mongoose = require('mongoose');
const { User, userSchema } = require('./user');
const { speciesSchema } = require('./species');

const Observation = mongoose.model('Observation', new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    species: { type: speciesSchema, required: true },
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
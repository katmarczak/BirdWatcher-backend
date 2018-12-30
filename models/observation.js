const mongoose = require('mongoose');
const Joi = require('joi');

const Observation = mongoose.model('Observation', new mongoose.Schema({
    owner: { type: String, required: true },
    species: { type: String, required: true },
    date: Date,
    visible: { type: Boolean, default: true }
}));

function validateObservation(observation) {
    const schema = Joi.object().keys({
        species: Joi.string().min(3),
        owner: Joi.string().min(3),
        visible: Joi.boolean()
    });

    return Joi.validate(observation, schema);
}

module.exports.Observation = Observation;
module.exports.validate = validateObservation;
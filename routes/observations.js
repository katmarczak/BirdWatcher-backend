const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Joi = require('joi');

const Observation = mongoose.model('Observation', new mongoose.Schema({
    owner: { type: String, required: true },
    species: { type: String, required: true },
    date: Date,
    visible: { type: Boolean, default: true }
}));

// FUNCTIONS

function validateObservation(observation) {
    const schema = Joi.object().keys({
        species: Joi.string().min(3),
        owner: Joi.string().min(3),
        visible: Joi.boolean()
    });

    return Joi.validate(observation, schema);
}

// ROUTES

router.get('/', async (request, response) => {
    const observations = await Observation.find().sort('-date');
    response.send(observations);
});

router.get('/:id', async (request, response) => {
    const observation = await Observation.findById(request.params.id);

    if(!observation) return response.status(404).send('Not found!')
    response.send(observation);
});

router.post('/', async (request, response) => {
    const { error } = validateObservation(request.body);
    if(error) return response.status(400).send(error.details[0].message);

    let newObservation = new Observation({
        owner: request.body.owner,
        species: request.body.species,
        date: request.body.date
    });
    newObservation = await newObservation.save();        

    response.send(newObservation);
})

router.put('/:id', async (request, response) => {
    const { error } = validateObservation(request.body);
    if(error) return response.status(400).send(error.details[0].message);

    const observation = await Observation.findOneAndUpdate(request.params.id, { 
        species: request.body.species, 
        visible: request.body.visible
    }, { new: true });
    if(!observation) return response.status(404).send('Not found!');

    response.send(observation);
});

router.delete('/:id', async (request, response) => {
    const observation = await Observation.findOneAndDelete(request.params.id);
    if(!observation) return response.status(404).send('Not found!');

    response.send(observation);
});

module.exports = router;
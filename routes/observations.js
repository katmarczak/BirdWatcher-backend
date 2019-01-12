const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Observation = require('../models/observation');
const { Species } = require('../models/species');
const { User } = require('../models/user');

router.get('/', async (request, response) => {
    const observations = await Observation.find().populate('owner', 'username -_id').sort('species');
    response.send(observations);
});

router.get('/:id', async (request, response) => {
    const observation = await Observation.findById(request.params.id);

    if(!observation) return response.status(404).send('Not found!')
    response.send(observation);
});

router.post('/', async (request, response) => {
    let owner = await User.findById(request.body.userId);
    if(!owner) return response.status(400).send('Invalid user id'); // TODO check if own id
    
    let species = await Species.findById(request.body.speciesId);
    if(!species) return response.status(400).send('Invalid species');

    let newObservation = new Observation({
        owner: request.body.userId,
        species: species,
        exactLocation: request.body.exactLocation,
        date: request.body.date
    });
    newObservation = await newObservation.save();        

    response.send(newObservation);
})

router.put('/:id', async (request, response) => {
    const observation = await Observation.findOneAndUpdate(request.params.id, {
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
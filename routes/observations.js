const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Observation } = require('../models/observation');
const { Species } = require('../models/species');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

//TODO: more flexible search
router.get('/search', asyncMiddleware(async (request, response) => {
    const observations = await Observation.find({ owner: { _id: request.query.userId }, visible: true}).populate('owner', 'username _id');
    if(!observations) return response.status(404).send('Not found!')
    response.send(observations);
}));

router.get('/', asyncMiddleware(async (request, response) => {
    const observations = await Observation.find({ visible: true }).populate('owner', 'username _id').sort('date');
    response.send(observations);
}));

router.get('/:id', asyncMiddleware(async (request, response) => {
    const observation = await Observation.findById(request.params.id).populate('owner', 'username _id');

    if(!observation || !observation.visible) return response.status(404).send('Not found!')
    response.send(observation);
}));

router.post('/', auth, asyncMiddleware(async (request, response) => {
    let owner = await User.findById(request.body.userId);
    if(!owner) return response.status(400).send('Invalid user id'); // TODO check if own id
    
    let species = await Species.findById(request.body.speciesId);
    if(!species) return response.status(400).send('Invalid species');

    let newObservation = new Observation({
        owner: request.body.userId,
        species: species,
        exactLocation: request.body.exactLocation,
        date: request.body.date,
        visible: request.body.visible
    });
    newObservation = await newObservation.save();        

    response.send(newObservation);
}));

router.put('/:id', auth, asyncMiddleware(async (request, response) => {
    const observation = await Observation.findOneAndUpdate(request.params.id, {
        visible: request.body.visible
    }, { new: true });
    if(!observation) return response.status(404).send('Not found!');

    response.send(observation);
}));

router.delete('/:id', auth, asyncMiddleware(async (request, response) => {
    const observation = await Observation.findOneAndDelete(request.params.id);
    if(!observation) return response.status(404).send('Not found!');

    response.send(observation);
}));

module.exports = router;
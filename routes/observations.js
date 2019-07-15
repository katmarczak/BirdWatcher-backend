const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Observation } = require('../models/observation');
const { Species } = require('../models/species');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

router.get('/test', asyncMiddleware(async (request, response) => {
    const filter = { 'owner.username': 'somethingsomething', $or: [{ 'species.commonName': /.*test.*/i }, { 'species.scientificName': { $regex: /.*test.*/i } }]};
    const obs = await Observation.find(filter);
    response.send(obs);
}));

router.get('/search', asyncMiddleware(async (request, response) => {
    const filter = buildFilter(request.query);
    const observations = await Observation.find(filter);
    if (!observations) return response.status(404).send('Not found!')
    response.send(observations);
}));

// TODO search with date/location
function buildFilter(query) {
    let filter = { visible: true };
    if (query.userId) filter['owner._id'] = { _id: query.userId };
    else if (query.username) filter['owner.username'] = { username: query.username };
    if (query.species) {
        const speciesRegExp = new RegExp(`.*${query.species}.*`, 'i');
        filter.$or = [{ 'species.commonName': { $regex: speciesRegExp } }, { 'species.scientificName': { $regex: speciesRegExp } }];
    }
    return filter;
}

router.get('/', asyncMiddleware(async (request, response) => {
    const observations = await Observation.find({ visible: true }).sort('date');
    response.send(observations);
}));

router.get('/:id', asyncMiddleware(async (request, response) => {
    const observation = await Observation.findById(request.params.id);

    if(!observation || !observation.visible) return response.status(404).send('Not found!')
    response.send(observation);
}));

router.post('/', auth, asyncMiddleware(async (request, response) => {
    const owner = await User.findById(request.user._id);
    if(!owner) return response.status(400).send('Invalid user id'); // TODO check if own id
    
    const species = await Species.findById(request.body.speciesId);
    if(!species) return response.status(400).send('Invalid species');

    let newObservation = new Observation({
        owner: owner,
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
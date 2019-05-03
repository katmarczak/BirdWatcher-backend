const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Species } = require('../models/species');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

router.get('/', asyncMiddleware(async (request, response) => {
    const species = await Species.find();
    response.send(species);
}));

router.get('/:id', asyncMiddleware(async (request, response) => {
    const species = await Species.findById(request.params.id);

    if(!species) return response.status(404).send('Not found!');
    response.send(species);
}));

router.post('/', auth, asyncMiddleware(async (request, response) => {
    let species = new Species({
        commonName: request.body.commonName,
        scientificName: request.body.scientificName
    });

    species = await species.save();
    response.send(species);
}));

router.put('/:id', auth, asyncMiddleware(async (request, response) => {    
    const species = await Species.findOneAndUpdate(request.params.id, {
        migratory: request.body.migratory
    }, { new: true });
    if(!species) reponse.status(404).send('Species not found');

    response.send(species);
}));

module.exports = router;
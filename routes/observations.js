const express = require('express');
const router = express.Router();
const { Observation } = require('../models/observation');
const { Species } = require('../models/species');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const checkuser = require('../middleware/checkuser');
const asyncMiddleware = require('../middleware/async');
const { PhotosUploader } = require('../utilities/fileStorage');
const { getObservationPhotoPath } = require('../utilities/fileStorage');
const { removeObservationFiles } = require('../utilities/fileStorage');

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
    else if (query.username) filter['owner.username'] = query.username;
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

router.get('/:id', checkuser, asyncMiddleware(async (request, response) => {
    let observation = await Observation.findById(request.params.id).lean();
    if(!observation || !observation.visible) return response.status(404).send('Not found!');
    if(request.user && request.user._id == observation.owner._id) {
        observation.editable = true;
    }
    const photoPath = await getObservationPhotoPath(request.params.id, observation.owner._id);
    observation.photoPath = photoPath;
    response.send(observation);
}));

router.post('/:id/pics', auth, PhotosUploader.array('photos', 4), function(request, response) {
    response.status(200).send();
});

router.post('/', auth, asyncMiddleware(async (request, response) => {
    const owner = await User.findById(request.user._id);
    if(!owner) return response.status(400).send('Invalid user id');

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
    const filter = { _id: request.params.id, 'owner._id': request.user._id };
    const species = await Species.findById(request.body.speciesId);
    const updateData = {
        species: species,
        exactLocation: request.body.exactLocation,
        date: request.body.date
    };
    const updatedObservation = await Observation.findOneAndUpdate(filter, updateData, { new: true });
    if(!updatedObservation) return response.status(404).send('Not found!');

    response.send(updatedObservation);
}));

router.delete('/:id', auth, asyncMiddleware(async (request, response) => {
    const observation = await Observation.findOneAndDelete({ '_id': request.params.id, 'owner._id': request.user._id});
    if(!observation) {
        return response.status(404).send('Not found!');
    } else {
        removeObservationFiles(observation._id, observation.owner._id);
    }

    response.status(200).send();
}));

module.exports = router;
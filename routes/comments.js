const express = require('express');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();
const { ObservationComment } = require('../models/comments/observationComment');
const { IdentificationComment } = require('../models/comments/observationComment');
const { User } = require('../models/user');

router.get('/search', asyncMiddleware(async (request, response) => {
    const filter = buildFilter(request.query);
    const comments = await ObservationComment.find(filter);
    response.send(comments);
}));

function buildFilter(query) {
    let filter = {};
    if(query.observationId) filter['observationId'] = query.observationId;
    return filter;
}

router.get('/:id', asyncMiddleware(async (request, response) => {
    const comment = await Comment.findById(request.params.id).lean();
    response.send(comment);
}));

router.post('/', auth, asyncMiddleware(async (request, response) => {
    const author = await User.findById(request.user._id);
    if(!author) return response.status(400).send('Invalid user id');

    let newComment;

    if(request.body.speciesId) {
        newComment = new IdentificationComment({
            author: author,
            text: request.body.text,
            observationId: request.body.observationId,
            speciesId: request.body.observationId,
            createdOn: Date.now()
        });
    } else {
        newComment = new ObservationComment({
            author: author,
            text: request.body.text,
            observationId: request.body.observationId,
            createdOn: Date.now()
        });
    }

    const savedComment = await newComment.save();
    response.send(savedComment);
}));

module.exports = router;
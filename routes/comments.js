const express = require('express');
const router = express.Router();
const { ObservationComment } = require('../models/comment');
const { IdentificationComment } = require('../models/comment');
const asyncMiddleware = require('../middleware/async');

router.get('/observation/:id', asyncMiddleware(async (request, response) => {
    const idComments = await IdentificationComment.find({observationId: request.params.id}).lean();
    const obsComments = await ObservationComment.find({observationId: request.params.id}).lean();

    const comments = [].concat(idComments, obsComments);

    response.send(comments);
}));

router.post('/observation', asyncMiddleware(async (request, response) => {
    let newComment;

    if(request.body.speciesId) {
        newComment = new IdentificationComment({
            authorId: request.body.authorId,
            text: request.body.text,
            observationId: request.body.observationId,
            speciesId: request.body.observationId,
            createdOn: Date.now()
        });
    } else {
        newComment = new ObservationComment({
            authorId: request.body.authorId,
            text: request.body.text,
            observationId: request.body.observationId,
            createdOn: Date.now()
        });
    }

    console.log(newComment);

    const savedComment = await newComment.save();
    response.send(savedComment);
}));

module.exports = router;
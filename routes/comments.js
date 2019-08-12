const express = require('express');
const router = express.Router();
const { ObservationComment } = require('../models/comment');
const { IdentificationComment } = require('../models/comment');
const asyncMiddleware = require('../middleware/async');

router.get('/observation/:id', asyncMiddleware(async (request, response) => {
    const idComments = await IdentificationComment.find({observationId: request.params.id}).lean();
    const obsComments = await ObservationComment.find({observationId: request.params.id}).lean();

    response.send({ idComments: idComments, obsComments: obsComments});
}));

router.post('/observation', asyncMiddleware(async (request, response) => {
    let newComment;

    if(request.body.speciesId) {
        newComment = new IdentificationComment({
            author: request.body.authorId,
            text: request.body.authorId.text || '',
            observationId: request.body.observationId,
            speciesId: request.body.observationId
        });
    } else {
        newComment = new ObservationComment({
            author: request.body.authorId,
            text: request.body.authorId.text,
            observationId: request.body.observationId
        });
    }

    const savedComment = await newComment.save();
    response.send(savedComment);
}));

module.exports = router;
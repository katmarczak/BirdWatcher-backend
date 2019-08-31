const mongoose = require('mongoose');
const extendSchema = require('../utilities/extendSchema');

const abstractCommentSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    editedOn: {
        type: Date
    }
});

const observationCommentSchema = extendSchema(
    abstractCommentSchema,
    {
        observationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Observation',
            required: true
        }
    });

const ObservationCommentModel = mongoose.model('Observation_Comment', observationCommentSchema);

const IdentificationCommentModel = ObservationCommentModel.discriminator('Identification_Comment',
    new mongoose.Schema({
        speciesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Species',
            required: true
        },
        text: {
            type: String,
            required: false
        },
        confirmed: Number,
        denied: Number
    }));

module.exports.ObservationComment = ObservationCommentModel;
module.exports.IdentificationComment = IdentificationCommentModel;

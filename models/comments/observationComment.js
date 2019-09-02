const mongoose = require('mongoose');
const extendSchema = require('../../utilities/extendSchema');
const CommentSchema = require('./commentSchema');

const options = { discriminatorKey: 'type' };

const observationCommentSchema = extendSchema(CommentSchema, {
    observationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Observation',
        required: true
    }
});

const ObservationComment = mongoose.model('Observation_Comment', observationCommentSchema);

const IdentificationComment = ObservationComment.discriminator('Identification_Comment',
    new mongoose.Schema({
        speciesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Species',
            required: true
        }
    },
    options));

module.exports.ObservationComment = ObservationComment;
module.exports.IdentificationComment = IdentificationComment;

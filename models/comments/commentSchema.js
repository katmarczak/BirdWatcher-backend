const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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

module.exports = commentSchema;
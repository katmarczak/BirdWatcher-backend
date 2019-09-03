const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        username: { type: String, required: true }
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
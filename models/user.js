const mongoose = require('mongoose');
// const Joi = require('joi);

const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 32 },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    registeredOn: { type: Date, default: Date.now }
}));

// FUNCTIONS
// TODO validateUser() with joi

module.exports.User = User;
// module.exports.validate = validateUser;
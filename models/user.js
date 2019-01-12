const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 32 },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    disabled: Boolean,
    registeredOn: { type: Date, default: Date.now },
    lastLoggedIn: Date,
    role: String  // change to enum?
});

const User = mongoose.model('User', userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, minlength: 3, maxlength: 32 },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 8 },
    registeredOn: { type: Date, default: Date.now },
    lastLoggedIn: Date,
    role: String,
    enabled: Boolean
});

const User = mongoose.model('User', userSchema);

User.prototype.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))
};

module.exports.User = User;
module.exports.userSchema = userSchema;
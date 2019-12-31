const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const asyncMiddleware = require('../middleware/async');

router.post('/', asyncMiddleware(async (request, response) => {
    let user = await User.findOne({ email: request.body.email });
    if(!user) return response.status(400).send('Invalid email or password');

    const isValid = await bcrypt.compare(request.body.password, user.password);

    if(!isValid) return response.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    user = await User.findByIdAndUpdate(user._id, { lastLoggedIn: Date.now() })
    
    return response.send({ token: token, user: _.pick(user, ['_id', 'username']) });
}));

router.get('/:token', async (request, response) => {
    const token = request.params.token;
    if(!token) return response.status(400).send('No token provided')

    try {
        jwt.verify(token, config.get('jwtPrivateKey'));
        return response.status(200).send('OK');
    } catch (exception) {
        return response.status(400).send('Invalid token.');
    }
});

module.exports = router;
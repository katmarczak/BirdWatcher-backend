const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { User } = require('../models/user');

router.post('/', async (request, response) => {
    let user = await User.findOne({ email: request.body.email }); // or username?
    if(!user) return response.status(400).send('Invalid email or password');

    const isValid = await bcrypt.compare(request.body.password, user.password);

    if(!isValid) return response.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    
    response.send(token);
});

module.exports = router;
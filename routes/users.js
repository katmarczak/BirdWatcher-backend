const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { User } = require('../models/user');

router.get('/', async (request, response) => {
    const users = await User.find().sort('-registeredOn');
    response.send(users);
});

router.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id);

    if(!user) return response.status(404).send('Not found!');
    response.send(user);
});

router.post('/', async (request, response) => {
    let user = new User({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password
    });

    user = await user.save();
    response.send(user);
});

router.put('/:id', async (request, response) => {
    const user = await User.findOneAndUpdate(request.params.id, {
        password: request.body.password
    }, { new: true });
    if(!user) reponse.status(404).send('User not found');

    response.send(user);
})

module.exports = router;
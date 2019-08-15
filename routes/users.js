const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

const multer = require('multer');
const avatarsStorage = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, 'uploads/avatars');
    },
    filename: function(request, file, callback) {
        callback(null, file.originalname);
    }
})
const avatarUploadDir = multer({ 
    storage: avatarsStorage,
    limits: { fileSize: 2e6 }
});

router.get('/', asyncMiddleware(async (request, response) => {
    const users = await User.find().select('-password -email').sort('-registeredOn');
    response.send(users);
}));

router.get('/:id', asyncMiddleware(async (request, response) => {
    const user = await User.findById(request.params.id);

    if(!user) return response.status(404).send('Not found!');
    response.send(_.pick(user, ['_id', 'username', 'registeredOn']));
}));

router.post('/avatar', avatarUploadDir.single('avatar'), asyncMiddleware(async (request, response) => {
    console.log(typeof request.file);
    console.log(request.file);
    response.send('ok?');
}));

router.post('/', asyncMiddleware(async (request, response) => {
    let user = await User.findOne({ email: request.body.email });
    if(user) return response.status(400).send('User with this email already exists');

    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    user = new User({
        username: request.body.username,
        email: request.body.email,
        password: hashedPassword
    });

    user = await user.save();
    response.send(_.pick(user, ['_id', 'username']));
}));

router.put('/:id', auth, asyncMiddleware(async (request, response) => {
    const user = await User.findOneAndUpdate(request.params.id, {
        password: request.body.password
    }, { new: true });
    if(!user) reponse.status(404).send('User not found');

    response.send(_.pick(user, ['_id', 'username', 'registeredOn']));
}));

module.exports = router;
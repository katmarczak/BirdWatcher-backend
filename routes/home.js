const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.send("Welcome to birdwatcher!")
});

module.exports = router;
const jwt = require('jsonwebtoken');
const config = require('config');

function auth(request, response, next) {
    const token = request.header('x-auth-token');
    if(!token) return response.status(401).send('Access denied, no token provided');

    try {
        request.user = jwt.verify(token, config.get('jwtPrivateKey'));
        next();
    } catch (exception) {
        response.status(400).send('Invalid token.');
    }
}

module.exports = auth;
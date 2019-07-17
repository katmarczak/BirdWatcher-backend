const jwt = require('jsonwebtoken');
const config = require('config');

function checkuser(request, response, next) {
    const token = request.header('x-auth-token');
    if(token) {
        try {
            request.user = jwt.verify(token, config.get('jwtPrivateKey'));
            next();
        } catch (exception) {
            next();
        }
    }
    next();
}

module.exports = checkuser;
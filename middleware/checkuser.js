const jwt = require('jsonwebtoken');

function checkuser(request, response, next) {
    const token = request.header('x-auth-token');
    if(token) {
        try {
            request.user = jwt.decode(token);
            next();
        } catch (exception) {
            next();
        }
    } else {
        next();
    }
}

module.exports = checkuser;
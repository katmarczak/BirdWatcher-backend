// return function analogous to the route handler

module.exports = function(handler) {
    return async (request, response, next) => {
        try {
            await handler(request, response);
        } catch (ex) {
            next(ex);
        }
    };
}
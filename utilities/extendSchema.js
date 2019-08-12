const mongoose = require('mongoose');
 
function extendSchema (Schema, definition, options) {
  return new mongoose.Schema(
    Object.assign({}, Schema.obj, definition),
    options
  );
}
 
module.exports = extendSchema;

// https://github.com/doasync/mongoose-extend-schema author: @doasync
const config = require('config');
const mongoose = require('mongoose');

module.exports.connect = function() {
    const db = config.get('dbString');
    const envName = config.get('name');
    mongoose.set('useCreateIndex', true);
    mongoose.connect(db, { useNewUrlParser: true })
      .then(() => {})
      .catch(error => console.error(`Could not connect to ${envName} database. `, error));
  }

module.exports.disconnect = function () {
    return mongoose.disconnect();
}
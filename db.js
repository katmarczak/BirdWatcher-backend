const config = require('config');
const mongoose = require('mongoose');

module.exports = function() {
    const db = config.get('dbString');
    const envName = config.get('name');
    mongoose.connect(db, { useNewUrlParser: true })
      .then(() => console.log(`Connected to ${envName} database.`))
      .catch(error => console.error(`Could not connect to ${envName} database. `, error));
  }
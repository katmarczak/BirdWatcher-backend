const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
    commonName: { type: String, required: true },
    scientificName: { type: String, required: true },
    statusPL: String,
    AERCcategoryPL: String
});

const Species = mongoose.model('Species', speciesSchema);

module.exports.speciesSchema = speciesSchema;
module.exports.Species = Species;
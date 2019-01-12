const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
    commonName: { type: String, required: true },
    scientificName: { type: String, required: true },
    order: String,
    redlistCategory: String,
    migratory: Boolean
});

const Species = mongoose.model('Species', speciesSchema);

module.exports.speciesSchema = speciesSchema;
module.exports.Species = Species;
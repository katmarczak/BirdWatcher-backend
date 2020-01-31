const { Species, validateSpecies } = require('../../../models/species');

describe('validateSpecies', () => {
    it('should return validated object when species is valid', () => {
        const args = {
            commonName: 'A name',
            scientificName: 'A scientific name',
            statusPL: 'L',
            AERCcategoryPL: 'A'
        };
        const species = new Species(args);
        const result =  validateSpecies(species);
        expect(result).toMatchObject({ value: args });
    });

    it('should return an error when species name is too short', () => {
        const args = {
            commonName: '_',
            scientificName: 'A scientific name'
        };
        const species = new Species(args);
        const { error } =  validateSpecies(species);
        expect(error).not.toBeNull();
    });
})
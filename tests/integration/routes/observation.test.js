const request = require('supertest');
const mongoose = require('mongoose');
const { Species } = require('../../../models/species');
const { Observation } = require('../../../models/observation');
const { disconnect } = require('../../../db');

const endpoint = '/observations';
let server;
let userId, speciesId, species;

afterAll(async () => {
    await disconnect();
});

describe(`${endpoint}`, () => {
    beforeEach(async () => {
        server = require('../../../index');

        userId = new mongoose.Types.ObjectId();
        speciesId = new mongoose.Types.ObjectId();
        species = new Species({ _id: speciesId, commonName: 'Common', scientificName: 'Scientific' });
    });

    afterEach(async () => {
        await server.close();
        await Observation.deleteMany({});
        await Species.deleteMany({});
    });

    describe('/search GET /', () => {
        beforeEach(async () => {
            const obj = {
                owner: { _id: userId, username: 'name' },
                species: species,
                date: "2019-10-31",
                exactLocation: { type: "Point", coordinates: [1, -1] }
            };
            const observation = new Observation(obj);
            await observation.save();
        });

        afterEach(async () => {
            await Observation.deleteMany({});
        });

        it('should return observations for a given username', async () => {
            const searchCriteria = { username: 'name' };

            const response = await request(server).get(`${endpoint}/search`)
                .query(searchCriteria);
            
            expect(response.status).toBe(200);
            expect(response.body[0].owner.username).toEqual('name');
        });

        it('should return observations for a given species', async () => {
            const searchCriteria = { species: 'Common' };

            const response = await request(server).get(`${endpoint}/search`)
                .query(searchCriteria);
            
            expect(response.status).toBe(200);
            expect(response.body[0].species.commonName).toEqual('Common');
        });

        it('should return observation fulfilling multiple criteria', async () => {
            const searchCriteria = { username: 'name', species: 'Scientific' };

            const response = await request(server).get(`${endpoint}/search`)
                .query(searchCriteria);
            
            expect(response.status).toBe(200);
            expect(response.body[0].owner.username).toEqual('name');
            expect(response.body[0].species.scientificName).toEqual('Scientific');
        });
    })

    describe('GET /', () => {
        it('should return all observations', async () => {
            await Observation.collection.insertMany([
                { owner: { _id: userId, username: 'name' }, species: species, date: "2019-10-31", exactLocation: { type: "Point", coordinates: [1, -1] }, visible: true },
                { owner: { _id: userId, username: 'name' }, species: species, date: "2019-10-31", exactLocation: { type: "Point", coordinates: [1, -1] }, visible: true }
            ]);

            const response = await request(server).get(`${endpoint}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });

    describe('GET /:id', () => {
        it('should return single observation', async () => {
            const obj = {
                owner: { _id: userId, username: 'name' },
                species: species,
                date: "2019-10-31",
                exactLocation: { type: "Point", coordinates: [1, -1] }
            };
            const observation = new Observation(obj);
            await observation.save();

            const response = await request(server).get(`${endpoint}/${observation._id}`);

            expect(response.status).toBe(200);
        });

        it('should not return 200 if id is invalid', async () => {
            const obj = {
                owner: { _id: userId, username: 'name' },
                species: species,
                date: "2019-10-31",
                exactLocation: { type: "Point", coordinates: [1, -1] }
            };
            const observation = new Observation(obj);
            await observation.save();

            const response = await request(server).get(`${endpoint}/1`);

            expect(response.status).not.toBe(200);
        });
    });
});
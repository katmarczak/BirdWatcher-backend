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
        await Observation.remove({});
        await Species.remove({});
    });

    describe('GET /', () => {
        it('should return all observations', async () => {
            await Observation.collection.insertMany([
                { owner: { _id: userId, username: 'name' }, species: species, date: "2019-10-31", exactLocation: { type: "Point", coordinates: [1, -1] }, visible: true },
                { owner: { _id: userId, username: 'name' }, species: species, date: "2019-10-31", exactLocation: { type: "Point", coordinates: [1, -1] }, visible: true }
            ]);

            const response = await request(server).get(`${endpoint}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            //expect(response.body).toContainEqual({ owner: { _id: fakeUserId, username: 'name' }, species: species, date: "2019-10-31", exactLocation: { coordinates: [1, -1] } });
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
            // delete obj.date;
            // expect(response.body).toMatchObject(obj);
            //expect(response.body.date).toEqual(expect.stringContaining("2019-10-31"));
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
const request = require('supertest');
const { Species } = require('../../../models/species');
const { User } = require('../../../models/user');
const { disconnect } = require('../../../db');
let server;

const endpoint = '/species';

afterAll(async () => {
    await disconnect();
});

describe(`${endpoint}`, () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => { 
        await server.close(); 
        await Species.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all species', async () => {
            await Species.collection.insertMany([
                { commonName: 'name1', scientificName: 'scientific name1' },
                { commonName: 'name2', scientificName: 'scientific name2' }
            ]);

            const response = await request(server).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(s => s.commonName === 'name1' && s.scientificName === 'scientific name1')).toBeTruthy();
            expect(response.body.some(s => s.commonName === 'name2' && s.scientificName === 'scientific name2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return single species', async() => {
            const obj = { commonName: 'name1', scientificName: 'scientific name1' };
            const species = new Species(obj);
            await species.save();

            const response = await request(server).get(`${endpoint}/${species._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(obj);
        });

        it('should not return 200 if id is invalid', async() => {
            const response = await request(server).get(`${endpoint}/1`);

            expect(response.status).not.toBe(200);
        });
    });

    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            const response = await request(server).post(`${endpoint}`).send({ commonName: 'name1', scientificName: 'scientific name1' });

            expect(response.status).toBe(401);
        });

        it('should return 400 if species name is too short', async () => {
            const token = new User().generateAuthToken();
            const response = await request(server)
                .post(`${endpoint}`)
                .set('x-auth-token', token)
                .send({ commonName: 'a', scientificName: 'b' });

            expect(response.status).toBe(400);
        });

        it('should return 400 if species name is too long', async () => {
            const token = new User().generateAuthToken();
            const longName = new Array(300).join('a');
            const response = await request(server)
                .post(`${endpoint}`)
                .set('x-auth-token', token)
                .send({ commonName: longName, scientificName: longName });

            expect(response.status).toBe(400);
        });

        it('should save a valid species to db', async () => {
            const token = new User().generateAuthToken();
            const response = await request(server)
                .post(`${endpoint}`)
                .set('x-auth-token', token)
                .send({ commonName: 'name1', scientificName: 'scientific name1' });
            
            const species = await Species.find({commonName: 'name1'});

            expect(species).not.toBeNull();
        });

        it('should return a valid species in response', async () => {
            const token = new User().generateAuthToken();
            const obj = { commonName: 'name1', scientificName: 'scientific name1' };
            const response = await request(server)
                .post(`${endpoint}`)
                .set('x-auth-token', token)
                .send(obj);

            expect(response.body).toHaveProperty('_id');
            expect(response.body).toMatchObject(obj);
        });
    })
})
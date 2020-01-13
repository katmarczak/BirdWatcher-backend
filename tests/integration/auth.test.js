const { User } = require('../../models/user');
const { Species } = require('../../models/species');
const request = require('supertest');
const { disconnect } = require('../../db');

const speciesEndpoint = '/species';
let token;

afterAll(async () => {
    await disconnect();
});

describe('Authentication middleware', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => {
        await Species.remove({});
        await server.close();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const response = await request(server)
            .post(`${speciesEndpoint}`)
            .set('x-auth-token', token)
            .send({ commonName: 'name1', scientificName: 'scientific name1' });

        expect(response.status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
        token = 'a';

        const response = await request(server)
            .post(`${speciesEndpoint}`)
            .set('x-auth-token', token)
            .send({ commonName: 'name1', scientificName: 'scientific name1' });

        expect(response.status).toBe(401);
    });

    it('should return 200 if token is valid', async () => {
        token = new User().generateAuthToken();

        const response = await request(server)
            .post(`${speciesEndpoint}`)
            .set('x-auth-token', token)
            .send({ commonName: 'name1', scientificName: 'scientific name1' });

        expect(response.status).toBe(200);
    });
});
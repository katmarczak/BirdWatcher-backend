const request = require('supertest');
let server;

describe('/species', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(() => { server.close(); });

    describe('GET /', () => {
        it('should return all species', async () => {
            const response = await request(server).get('/species');
            expect(response.status).toBe(200);
        })
    })
})
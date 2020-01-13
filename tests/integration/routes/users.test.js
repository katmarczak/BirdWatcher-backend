const request = require('supertest');
const { User } = require('../../../models/user');
const { disconnect } = require('../../../db');
const endpoint = '/users';

afterAll(async () => {
    await disconnect();
});

describe(`${endpoint}`, () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => { 
        await server.close(); 
        await User.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all users', async () => {
            await User.collection.insertMany([
                { username: 'name1', email: 'email1@domain.com', password: 'default1' },
                { username: 'name2', email: 'email2@domain.com', password: 'default2' }
            ]);

            const response = await request(server).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(u => u.username === 'name1')).toBeTruthy();
            expect(response.body.some(u => u.username === 'name2')).toBeTruthy();
            expect(response.body.every(u => u.hasOwnProperty('registeredOn'))).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return single user', async() => {
            const obj = { username: 'name1', email: 'email1@domain.com', password: 'default1' };
            const user = new User(obj);
            await user.save();

            const response = await request(server).get(`${endpoint}/${user._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('username', 'name1');
        });

        it('should not return 200 if id is invalid', async() => {
            const response = await request(server).get(`${endpoint}/1`);

            expect(response.status).not.toBe(200);
        });
    });

    describe('POST /', () => {
        it('should return 400 if email is already in use', async () => {
            const obj = { username: 'name1', email: 'email1@domain.com', password: 'default1' };
            const user = new User(obj);
            await user.save();

            const response = await request(server)
                .post(`${endpoint}`)
                .send({ username: 'name2', email: 'email1@domain.com', password: 'default1' });

            expect(response.status).toBe(400);
        });

        it('should return 400 if password is too short', async () => {
            const response = await request(server)
                .post(`${endpoint}`)
                .send({ username: 'name1', email: 'email1@domain.com', password: '1' });

            expect(response.status).toBe(400);
        });

        it('should save a valid user to db', async () => {
            await request(server)
                .post(`${endpoint}`)
                .send({ username: 'name1', email: 'email1@domain.com', password: 'default1' });
            
            const user = await User.find({ username: 'name1' });

            expect(user).not.toBeNull();
        });

        it('should return a valid user in response', async () => {
            const response = await request(server)
                .post(`${endpoint}`)
                .send({ username: 'name1', email: 'email1@domain.com', password: 'default1' });

            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('username', 'name1');
        });
    });
})
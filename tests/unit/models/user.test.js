const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return valid jwt', () => {
        const args = { _id: new mongoose.Types.ObjectId().toHexString() }
        const user = new User(args);
        const token = user.generateAuthToken();
        const result = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(result).toMatchObject(args);
    });

    it('should throw error when provided key is invalid', () => {
        const args = { _id: new mongoose.Types.ObjectId().toHexString() }
        const user = new User(args);
        const token = user.generateAuthToken();
        const invalidJwtPrivateKey = config.get('jwtPrivateKey') + 'foo';
        expect(() => { jwt.verify(token, invalidJwtPrivateKey) }).toThrow();
    });
});
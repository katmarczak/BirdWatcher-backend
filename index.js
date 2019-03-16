const config = require('config');
const mongoose = require('mongoose');

const startUpDebugger = require('debug')('app:startup')
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();

const observationsRouter = require('./routes/observations');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const speciesRouter = require('./routes/species');
const authRouter = require('./routes/auth');

if(!config.get('jwtPrivateKey')) {
    console.error('Cannot start app: Environment variable \'jwtPrivateKey\' is not defined');
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// ALLOW CORS ===========================================================
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startUpDebugger('Morgan enabled');
}

mongoose.connect('mongodb://localhost/birdwatcher', { useNewUrlParser: true })
    .then(() => console.log('Connected to db.'))
    .catch(error => console.error('Could not connect to db'));

// ROUTES ===============================================================
app.use('/species', speciesRouter);
app.use('/observations', observationsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/', homeRouter);

// CONFIG ===============================================================
console.log('App name: ' + config.get('name'));

// START SERVER =========================================================
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on a port ${port}...`));
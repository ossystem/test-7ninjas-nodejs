const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const router = require('./routes/router');
const cron = require('./crone/cron_list');

startApp();

async function startApp () {
    process.on('unhandledRejection', function (err) {
        console.error('unhandledRejection', err);
    });
    process.on('uncaughtException', function (err) {
        console.error('uncaughtException', err);
    });
    process.on('warning', (err) => {
        console.warn(err);
    });

    const mongoUri = 'mongodb://127.0.0.1:27017/test_project_db';
    mongoose.connect(mongoUri, { useNewUrlParser: true });
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', () => { console.error('MongoDB connection error:')});
    db.on('open', () => { console.log('MongoDB connection established')});

    cron.start();

    app.use('/public', express.static(__dirname + '/public'));
    router(app);

    app.use( (err, req, res, next) => {
        if (err) {
            console.log(`error ${err}`);
            if (!res.headerSent) {
                res.status(503).json({message:err});
            }
        }
    });
    const PORT = process.env.PORT || 3000;
    app.listen(3000,  () => {
        console.log(`Server listening on port  ${PORT}`);
    })
}


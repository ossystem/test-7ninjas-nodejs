const schedule = require('node-schedule');

const helpers = require('../helpers/helper');

helpers.sendMailToAdmin();

const cron = {
    start: () => {
        schedule.scheduleJob('0 0 8 * * *', () => {
            helpers.sendMailToAdmin();
        });
    }
};

module.exports = cron;
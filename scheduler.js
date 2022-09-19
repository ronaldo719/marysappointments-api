

const CronJob = require('cron').CronJob;
const notificationsWorker = require('./workers/notificationWorker');
const deleteWorker = require('./workers/deleteWorker');
const moment = require('moment');

const schedulerFactory = function () {
    return {
        start: function () {
            new CronJob('0 10 * * *', function () {
                console.log('Running Send Notifications Worker for ' +
                    moment().format());
                notificationsWorker.run();
                deleteWorker.run();
            }, null, true, '');
        },
    };
};

module.exports = schedulerFactory();

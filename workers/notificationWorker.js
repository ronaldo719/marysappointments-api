
const Model = require('../models/index');
const { OlgaAppointment, MaryAppointment } = Model;

const notificationWorkerFactory = function () {
    return {
        run: function () {
            OlgaAppointment.sendNotifications();
            MaryAppointment.sendNotifications();
        },
    };
};

module.exports = notificationWorkerFactory();

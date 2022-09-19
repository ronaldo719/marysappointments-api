const Model = require('../models/index');
const { OlgaAppointment, MaryAppointment } = Model;

const deleteWorkerFactory = function () {
    return {
        run: function () {
            OlgaAppointment.deleteOldAppointments();
            MaryAppointment.deleteOldAppointments();
        },
    };
};

module.exports = deleteWorkerFactory();

const mongoose = require('mongoose');
const moment = require('moment');
const Twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.FROM_PHONE;

const Schema = mongoose.Schema,
    model = mongoose.model.bind(mongoose),
    ObjectId = mongoose.Schema.Types.ObjectId;



const appointmentOlgaSchema = new Schema({
    id: ObjectId,
    name: String,
    email: String,
    phone: Number,
    category: String,
    service: String,
    staff: String,
    start_time: Number,
    end_time: Number,
    appointment_date: Date,
    display_time: String,
    language: String,
    created_at: Date
});



const appointmenMarySchema = new Schema({
    id: ObjectId,
    name: String,
    email: String,
    phone: Number,
    category: String,
    service: String,
    staff: String,
    start_time: Number,
    end_time: Number,
    appointment_date: Date,
    display_time: String,
    language: String,
    created_at: Date
});


appointmentOlgaSchema.methods.requiresNotification = function () {

    // check if one day before appointment date
    return moment(this.appointment_date).subtract(1, 'days').format('l') === moment().format('l')

};

appointmentOlgaSchema.statics.sendNotifications = function (callback) {

    OlgaAppointment
        .find()
        .then(function (appointments) {
            appointments = appointments.filter(function (appointment) {
                return appointment.requiresNotification();
            });
            if (appointments.length > 0) {
                sendNotifications(appointments);
            }
        });

    /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} appointments List of appointments.
    */
    function sendNotifications(appointments) {
        const client = new Twilio(accountSid, authToken);
        appointments.forEach(function (appointment) {
            const msg = language === "english" ?
                `Hi ${appointment.name}. Just a reminder that you have an appointment tomorrow at ${appointment.display_time}.`
                :
                `Hola ${appointment.name}. Solo un recordatorio de que tiene una cita mañana a las ${appointment.display_time}.`
            // Create options to send the message
            const options = {
                to: `+1${appointment.phone.toString()}`,
                from: `${from}`,
                /* eslint-disable max-len */
                body: `${msg}`,
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function (err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = appointment.phone.toString().substr(0,
                        appointment.phone.toString().length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        });

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
            callback.call();
        }
    }
};

appointmentOlgaSchema.methods.requiresDelete = function () {

    // check if three day old appointment which no longer needs to be stored
    return moment(this.appointment_date).format('l') === moment().subtract(3, 'days').format('l')

};


appointmentOlgaSchema.statics.deleteOldAppointments = function () {

    //find old appointments to delete
    OlgaAppointment
        .find()
        .then(function (appointments) {
            appointments = appointments.filter(function (appointment) {
                return appointment.requiresDelete();
            });
            if (appointments.length > 0) {
                deleteOldAppointments(appointments);
            }
        });

    //delete all old appointments found 
    function deleteOldAppointments(appointments) {
        appointments.forEach(function (appointment) {
            OlgaAppointment.deleteOne({ phone: appointment.phone }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Appointments olga deleted!')
                }
            });
        });
    }
}


appointmenMarySchema.methods.requiresNotification = function () {

    // check if one day before appointment date
    return moment(this.appointment_date).subtract(1, 'days').format('l') === moment().format('l')

};

appointmenMarySchema.statics.sendNotifications = function (callback) {

    MaryAppointment
        .find()
        .then(function (appointments) {
            appointments = appointments.filter(function (appointment) {
                return appointment.requiresNotification();
            });
            if (appointments.length > 0) {
                sendNotifications(appointments);
            }
        });

    /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} appointments List of appointments.
    */
    function sendNotifications(appointments) {
        const client = new Twilio(accountSid, authToken);
        appointments.forEach(function (appointment) {
            const msg = language === "english" ?
                `Hi ${appointment.name}. Just a reminder that you have an appointment tomorrow at ${appointment.display_time}.`
                :
                `Hola ${appointment.name}. Solo un recordatorio de que tiene una cita mañana a las ${appointment.display_time}.`
            // Create options to send the message
            const options = {
                to: `+1${appointment.phone.toString()}`,
                from: `${from}`,
                /* eslint-disable max-len */
                body: `${msg}`,
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function (err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = appointment.phone.toString().substr(0,
                        appointment.phone.toString().length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        });

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
            callback.call();
        }
    }
};


appointmenMarySchema.methods.requiresDelete = function () {

    // check if three day old appointment which no longer needs to be stored
    return moment(this.appointment_date).format('l') === moment().subtract(3, 'days').format('l')

};



appointmenMarySchema.statics.deleteOldAppointments = function () {

    //find old appointments to delete
    MaryAppointment
        .find()
        .then(function (appointments) {
            appointments = appointments.filter(function (appointment) {
                return appointment.requiresDelete();
            });
            if (appointments.length > 0) {
                deleteOldAppointments(appointments);
            }
        });


    //delete all old appointments found 
    function deleteOldAppointments(appointments) {
        appointments.forEach(function (appointment) {
            MaryAppointment.deleteOne({ phone: appointment.phone }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Appointments mary deleted!')
                }
            });
        });
    }
}



const OlgaAppointment = model('OlgaAppointment', appointmentOlgaSchema);
const MaryAppointment = model('MaryAppointment', appointmenMarySchema);

module.exports = {
    OlgaAppointment, MaryAppointment
}


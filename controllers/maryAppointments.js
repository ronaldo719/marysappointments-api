const Model = require('../models/index');
const { MaryAppointment } = Model;
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.FROM_PHONE;
const client = require('twilio')(accountSid, authToken);


const maryAppointmentController = {
    all(req, res) {
        // Returns all appointments

        MaryAppointment.find({}).exec((err, appointments) => res.json(appointments));
    },
    create(req, res) {

        var requestBody = req.body;
        const to = requestBody.phone || req.headers.phone;
        const name = requestBody.name || req.headers.name;
        const language = requestBody.language || req.headers.language;
        const date = req.headers.appointment_date || requestBody.appointment_date;
        const staff = requestBody.staff || req.headers.staff;
        const time = requestBody.display_time || req.headers.display_time;

        // Creates a new record from a submitted form
        var newappointment = new MaryAppointment({
            name: name,
            email: requestBody.email || req.headers.email,
            phone: to,
            category: requestBody.category || req.headers.category,
            service: requestBody.service || req.headers.service,
            staff: staff,
            start_time: requestBody.start_time || req.headers.start_time,
            end_time: requestBody.end_time || req.headers.end_time,
            appointment_date: date,
            display_time: time,
            language: language,
            created_at: Date.now()
        });


        // and saves the record to the database
        newappointment.save((err, saved) => {
            // Returns the saved appointment
            // after a successful save
            MaryAppointment.find({ _id: saved._id })
                .exec((err, appointment) => res.json(appointment));

            const msg = language === "english" ?
                `Hello ${name}, this message is to confirm your appointment at Mary's Beauty Salon on ${moment(date).format('l')} at ${time} with ${staff}. Looking forward to seeing you. If you woukld like to cancel your appointment. Follow the directions here: http://localhost:3000/delete`
                :
                `Hola ${name}, este mensaje es para confirmar tu cita en Mary's Beauty Salon el ${moment(date).format('l')} a las ${time} con ${staff}. Nos miramos pronto. Si desea cancelar su cita. Siga las instrucciones aquí: http://localhost:3000/delete`

            client.messages
                .create({
                    body: `${msg}`,
                    to: `+1${to.toString()}`, // Text this number
                    from: `${from}`, // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));
        });
    },

    delete(req, res) {

        MaryAppointment.deleteOne({ phone: req.body.phone || req.headers.phone }, function (err) {

            if (err) {
                console.log(err);
            } else {
                res.json("delete successful");
            }
        });
    }
};
module.exports = maryAppointmentController;
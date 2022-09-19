let express = require('express')
const router = express.Router();

const olgaAppointmentController = require('../../controllers/olgaAppointments')
router.get('/olgaappointments', olgaAppointmentController.all);
router.post('/olgaappointmentCreate', olgaAppointmentController.create);
router.delete('/olgaappointmentDelete', olgaAppointmentController.delete);

const maryAppointmentController = require('../../controllers/maryAppointments')
router.get('/maryappointments', maryAppointmentController.all);
router.post('/maryappointmentCreate', maryAppointmentController.create);
router.delete('/maryappointmentDelete', maryAppointmentController.delete);
module.exports = router;
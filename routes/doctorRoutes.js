const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController,
    updateDoctorInfoController,
    doctorAppointmentController,
    getDoctorByIdController, 
    appointmentStatusController} = require('../controllers/doctorCtrl');

const router = express.Router();

// post single doctor info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

// update single doctor info

router.post('/updateDoctorInfo', authMiddleware, updateDoctorInfoController);

// get doctor by id || POST Method

router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

// get All Appointment || GET Method
router.get('/doctorAppointment', authMiddleware, doctorAppointmentController);

// change appointment status || POST Method
router.post('/changeAppointStatus', authMiddleware, appointmentStatusController);

module.exports = router;
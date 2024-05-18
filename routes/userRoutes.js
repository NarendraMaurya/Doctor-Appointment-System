const express = require('express');
const { loginController,
    registerController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDocController,
    bookAppointmentontroller,
    bookingAvailbilityController,
    userAppointmentControler,
    authController} = require('../controllers/userCtrl'); 
const authMiddleware = require('../middlewares/authMiddleware');

// router object

const router = express.Router();

//routes
//LOGIN ||POST

router.post('/login', loginController);
router.post('/register', registerController);

//apply doctor ||POST

router.post('/apply-doctor', authMiddleware, applyDoctorController);

//notification ||POST

router.post('/get-all-notification', authMiddleware, getAllNotificationController);
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

//get all doctors list

router.get('/getAllDoctor', authMiddleware, getAllDocController);

// book appointment || POST method
router.post('/bookAppointment', authMiddleware, bookAppointmentontroller);

// booking availbility  || POST Method
router.post('/bookingAvailbility', authMiddleware, bookingAvailbilityController);

// get All appointment || POST method
router.get('/userAppointment', authMiddleware, userAppointmentControler);



// auth  || post
router.post('/getUserData', authMiddleware, authController);

module.exports = router;
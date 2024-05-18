const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {getAllDoctorsController,getAllUsersController,changeAcountStatusController,changeActivrStatusController} =require('../controllers/adminCtrl');

const router = express.Router();

//GET method || USERS
router.get('/getAllUsers', authMiddleware, getAllUsersController);

//GET method || Doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//POST method || ChangeAccountStatus
router.post('/changeAcountStatus', authMiddleware, changeAcountStatusController);

//POST method || change active user status
router.post('/changeActiveStatus', authMiddleware, changeActivrStatusController);

module.exports = router;
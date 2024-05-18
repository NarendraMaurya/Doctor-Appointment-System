const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

//register callback
const registerController = async(req,res) => {
    try {
        const existingUser =await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message:'User Already Exist', success: false });
        } else {
            const password = req.body.password;
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;
            const newUser = new userModel(req.body);
            await newUser.save();
            res.status(201).send({ message: 'Register succesfully', success: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Register controller ${error.message}` });
    }
}

//login callback
const loginController = async(req,res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        } else {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(200).send({ message: 'Invalid Email or Password ', success: false });
            } else {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                res.status(200).send({ message: 'Login Sucsess', success: true, token });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login Ctrl ${error.message}`, success: false });
    }
}

//doctor apply callback

const applyDoctorController = async(req,res) => {
    try {
        const doctor = await doctorModel.findOne({ email: req.body.email });
        if (!doctor) {
            const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
            await newDoctor.save();
            const adminUser = await userModel.findOne({ isAdmin: true });
            const notification = adminUser.notification;
            notification.push({
                type: 'apply-doctor-request',
                message: `${newDoctor.name} is applied for doctor account`,
                data: {
                    doctorId: newDoctor._id,
                    name: newDoctor.name,
                    onClickPath:'/admin/doctors',
                }
            })
            await userModel.findByIdAndUpdate(adminUser._id , { notification });
            res.status(200).send({ message: 'Doctor application saved successfully', success: true });
        } else {
            res.status(200).send({ message: 'Doctor already exist', success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Error while applying doctor ${error.message}`,
            success:false
        })
    }
}

//notification controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        const seenNotification = user.seenNotification;
        const notification = user.notification;
        seenNotification.push(...notification);
        user.notification = [];
        user.seenNotification = seenNotification;
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            message: 'All notification marked as read',
            success: true,
            data:updatedUser,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error in notification', success: false,error });
    }
}

//delete all notification callback
const deleteAllNotificationController = async(req, res) =>{
    try {
        const user = await userModel.findById(req.body.userId);
        user.seenNotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            message: 'All notification deleted successfully',
            success: true,
            data:updatedUser,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error in deleting notification', success: false,error });
    }
}

//get all doctor list
const getAllDocController = async(req,res) => { 
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: 'Doctor list updated successfully',
            data: doctors
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in loading doctors list',
            error
        });
    }
};

// book appointment controller

const bookAppointmentontroller = async (req, res)=>{
    try {
        // console.log('req.body', req.body);
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        req.body.time = moment(req.body.time, 'hh:mm A').toISOString();
        req.body.status = 'pending';
        const user = await userModel.findById(req.body.userId);
        const doctor = await userModel.findById(req.body.doctorInfo.userId);
        req.body.doctorId = req.body.doctorId;
        req.body.userId = req.body.userId;
        console.log(req.body.userId);
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const userNotification = user.notification;
        userNotification.push({
            type: 'new-appointment-request',
            message: `Your appointment request is initiated with ${req.body.doctorInfo.name} on ${req.body.date} `,
            onClickPath:'/user/appointments'
        });
        const doctorNotification = doctor.notification;
        doctorNotification.push({
            type: 'new-appointment-request',
            message: `Your have a new appointment request from ${req.body.userInfo.name} on ${req.body.date}`,
            onClickPath:'/doctor/appointments'
        });
        await user.save();
        await doctor.save();
        res.status(201).send({
            success: true,
            message: 'Appointment booked Successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Booking Appointment',
            error
        })
    }
};

// booking availbility controller
const bookingAvailbilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm A').subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, 'HH:mm A').add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId;

        const appointments = await appointmentModel.find({
            doctorId, date,
            time: {
                $gte: fromTime, $lte: toTime
            }
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                success: true,
                message: 'Appointment not Available at this time',
                available:false
            });
        } else {
            return res.status(200).send({
                success: true,
                message: 'Appointmet is available at time',
                available:true
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Checking Booking Availbility',
            error
        });
    }
};

//get All Appointment controller

const userAppointmentControler = async (req, res) => {
    try {
        const appointment = await appointmentModel.find({
            userId: req.body.userId
        });
        res.status(200).send({
            success: true,
            message: 'Appointment loaded successfully',
            data: appointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in loading Appointments',
            error
        })
    }
};



// auth callback
const authController =async (req,res) => {
    try {
        // console.log(req.body);
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.status(200).send({
                message: 'user not found',
                success: false,
            });
        } else {
            user.password = undefined;
            res.status(200).send({
                success: true,
                data: user
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Auth Error',
            success: false,
            error
        });
    }
}



module.exports = {
    loginController,
    registerController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDocController,
    bookAppointmentontroller,
    bookingAvailbilityController,
    userAppointmentControler,
    authController,
};
const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel =require('../models/appointmentModel');

// get doctor profile info 
const getDoctorInfoController = async(req,res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userID });
        res.status(200).send({
            success: true,
            message: 'doctor data loaded successfully',
            data: doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in loading doctor details',
            error
        });
    }
}

//update doctor profile info
const updateDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: 'Your Profile updated successfully',
            data: doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating doctor info',
            error
        });
    }
};

const getDoctorByIdController = async (req,res) => {
    try {
        const doctor = await doctorModel.findById(req.body.doctorId);
        res.status(200).send({
            success: true,
            message: 'Doctor data loaded successfully',
            data: doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in get doctor controller',
            error
        });
    }
}

// get all appointment controller
const doctorAppointmentController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({doctorId:doctor._id});
        res.status(200).send({
            success: true,
            message: 'Doctor Appointment loaded successfully ',
            data:appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in doctor appointment',
            error
        });
    }
};

// Change appointment status Controller

const appointmentStatusController = async (req, res) => { 
    try {
        const { doctorId, status } = req.body;
        const appointment = await appointmentModel.findOne({ doctorId });
        const user = await userModel.findOne({ _id: appointment.userId });
        appointment.status = req.body.status;
        const notification = user.notification;
        notification.push({
            type: 'user-appointment-status-changed',
            message: `Your appointment has been ${status}`
        });
        await user.save();
        await appointment.save();
        res.status(200).send({
            success: true,
            message: 'Appointment Status updated successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in changing appointment status', 
            error
        });
    }
};

module.exports = {
    getDoctorInfoController,
    updateDoctorInfoController,
    doctorAppointmentController,
    getDoctorByIdController,
    appointmentStatusController
};
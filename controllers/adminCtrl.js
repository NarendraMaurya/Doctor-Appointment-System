const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');

// get All user callback 
const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({isAdmin:false});
        res.status(200).send({ success: true, message: 'user loaded successfully', data: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in loading users list', error });
    }
};


//get all doctor callback
const getAllDoctorsController = async (req,res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({ success: true, message: 'user loaded successfully', data: doctors });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in loading doctors list', error });
    }
};

//change account status
const changeAcountStatusController = async (req,res) => {
    try {
        const { doctorId, userID,status } = req.body;
        // console.log(req.body);
        const doctor = await doctorModel.findByIdAndUpdate(doctorId,{status});
        const user = await userModel.findById(userID);
        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your doctor account request has been ${status}`,
            onClickPath:'/notification'
        })
        user.isDoctor=(status === 'approved' ? true : false);
        await user.save();
        res.status(200).send({ success: true, message: "Account Status updated successfully",data:doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in Updating the status', error }); 
    }
}

const changeActivrStatusController = async (req,res) => {
    try {
        const { userID, status } = req.body;
        const user = await userModel.findById(userID);
        const notification = user.notification;
        notification.push({
            type: 'user-account-status-accepted',
            message: `Your account has been ${status}`,
            onClickPath:'/notification',
        })
        user.isActive = (status === 'unblocked' ? true : false);
        await user.save();
        res.status(200).send({ success: true, message: `${user.name} is successfully ${status}`, data: user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in changing the user status', error })
    }
}

module.exports = { getAllDoctorsController, getAllUsersController ,changeAcountStatusController,changeActivrStatusController};

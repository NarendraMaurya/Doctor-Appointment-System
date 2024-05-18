const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        require:true
    },
    doctorId: {
        type: String,
        require:true,
    },
    doctorInfo: {
        type: Object,
        require:true,
    },
    userInfo: {
        type: Object,
        require:true,
    },
    date: {
        type: String,
        require:true,
    },
    time:{
        type: String,
        require:true,
    },
    status: {
        type: String,
        require:true,
    }
},{timestamps:true});

const appointmentModel = mongoose.model('appointment', appointmentSchema);
module.exports = appointmentModel;
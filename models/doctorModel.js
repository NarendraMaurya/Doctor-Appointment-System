const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    userId: {
        type:String,
    },
    name: {
        type: String,
        require:[true,'name is required']
    },
    phone:{
        type: String,
        require:[true,'Phone number is required']
    },
    email: {
        type: String,
        require:[true,'Email is required']
    },
    website: {
        type:String,
    },
    address: {
        type: String,
        require:[true,'address is required']
    },
    specialization: {
        type: String,
        require:[true,'Specialization is required']
    },
    experience: {
        type: String,
        require:[true,'experience is required']
    },
    fees: {
        type: String,
        require:[true,'fee is required']
    },
    status: {
        type: String,
        default:'pending'
    },
    timings: {
        type: Object,
        require:[true,'Work timing is required']
    }
},
    {timestamps:true}
);

const doctorModel = mongoose.model('doctor', doctorSchema);

module.exports = doctorModel;
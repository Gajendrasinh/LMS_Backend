const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const staffModel = new Schema({
    firstname: {
        type: String,
        default: '',
        required: true
    },
    lastname: {
        type: String,
        default: '',
        required: true
    },
    email: {
        type: String,
        default: '',
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: '',
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College',
    },
    dob: {
        type: Schema.Types.String,
        default: ''
    },
    logo: {
        type: Schema.Types.String,
        default: ''
    },
    dateofjoining: {
        type: Schema.Types.String,
        default: ''
    },
    department: {
        type: Schema.Types.String,
        default: ''
    },
    coursename: {
        type: Schema.Types.String,
        default: ''
    },
    phone: {
        type: Schema.Types.String,
        default: ''
    },
    address: {
        type: Schema.Types.String,
        default: ''
    },
    createdAt: {
        type: Schema.Types.Date,
        default: '',
        required: true
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false,
    }
})  

const Staff = dbClient.model('Staff', staffModel);

module.exports = Staff;
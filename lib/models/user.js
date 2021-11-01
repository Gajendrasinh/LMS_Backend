const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const userModel = new Schema({
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
        required: true
    },
    logo: {
        type: Schema.Types.String,
        default: ''
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
    createdBy: {
        type: Schema.Types.ObjectId,
        default: '',
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    }
})  

const User = dbClient.model('User', userModel);
dbClient.collection("users").getIndexes().then(res =>{
    dbClient.collection("users").createIndex({"$**": "text"}).then(res => console.log(res, "users")) 
})
module.exports = User;
const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const webinarModel = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    college: { 
        type: Schema.Types.ObjectId,
        ref: 'College',
    }, 
    course: { 
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    department: {
        type: Schema.Types.String,
        default: ''
    }, 
    password: {
        type: Schema.Types.String,
        default: ''
    }, 
    time: {
        type: Schema.Types.String,
        default: ''
    },
    status: {
        type: Schema.Types.String,
        default: "upcoming"
    },
    url: {
        type: Schema.Types.String,
        default: ""
    },
    createdAt: {
        type: Schema.Types.Date,
        default: ''
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: ''
    }
})

const Webinar = dbClient.model('Webinar', webinarModel);

module.exports = Webinar;
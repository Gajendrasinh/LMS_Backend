const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');


const feedbackModel = new Schema({
    name: {
        type: Schema.Types.String,
        default: '',
        required: true
    },
    type: {
        type: Schema.Types.String,
        default: '',
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    comment: {
        type: Schema.Types.String,
        default: '',
        required: true
    },
    createdAt: {
        type: Schema.Types.Date,
        default: '',
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    },
});

const Feedback = dbClient.model("Feedback", feedbackModel);
module.exports = Feedback;
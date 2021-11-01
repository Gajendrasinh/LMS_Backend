const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');


const badgeModel = new Schema({
    name: {
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
        ref: 'User'
    },
    badgeType: {
        type: Schema.Types.String,
        default: 'exam'
    },
    taskId: {
        type: Schema.Types.String,
        default: ''
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    }

});

const Badge = dbClient.model('Badge', badgeModel);

module.exports = Badge;
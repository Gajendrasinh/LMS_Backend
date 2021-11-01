const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const collegeModel = new Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    email: {
        type: String,
        default: '',
        required: true
    },
    password: {
        type: String,
        default: 'test',
        required: true
    },
    logo: {
        type: String,
        default: '',
    },
    phone: {
        type: Schema.Types.String,
        default: ''
    },
    address: {
        type: Schema.Types.String,
        default: ''
    },
    noofstaffs: {
        type: Schema.Types.Number,
        default: ''
    },
    department: {
        type: [Schema.Types.String],
        default: []
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
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    }, 
    role: {
        type: Schema.Types.String,
        default: 'college'
    }
})  

const College = dbClient.model('College', collegeModel);
dbClient.collection("colleges").getIndexes().then(res => {
    dbClient.collection("colleges").createIndex({"$**": "text"})
})
module.exports = College;
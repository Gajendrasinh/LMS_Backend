const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const tutorialModel = new Schema({
    name: {
        type: Schema.Types.String,
        default: '',
        required: true
    },
    description: {
        type: Schema.Types.String,
        default: '',
        required: true
    },
    logo: {
        type: Schema.Types.String,
        default: '',
    },
    createdAt: {
        type: Schema.Types.Date,
        default: '',
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    },
    cost: {
        type: Schema.Types.Number,
        default: 0
    },
    file: {
        type: Schema.Types.String,
        default: ''
    },
    category: {
        type: Schema.Types.String,
        default: ''
    },
    duration: {
        type: Schema.Types.String,
        default: ''
    }
    
})

const Tutorial = dbClient.model("Tutorial", tutorialModel);
// dbClient.collection("tutorials").getIndexes().then(res =>{
//     dbClient.collection("tutorials").createIndex({"$**": "text"}).then(res => console.log(res)) 
// })
module.exports = Tutorial;
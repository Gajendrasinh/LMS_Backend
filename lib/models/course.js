const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');


const courseModal = new Schema({
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
    file: {
        type: Schema.Types.String,
        default: '',
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    
    subCategory: {
        type: Schema.Types.String,
        default: '',
    }, 
    price: {
        type: Schema.Types.String,
        default: '',
    }, 
    discount: {
        type: Schema.Types.String,
        default: '',
    }, 
    createdAt: {
        type: Schema.Types.Date,
        default: '',
    }, 
    college: {
        type: Schema.Types.ObjectId,
        ref: "College"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    chapters: {
        type: Schema.Types.Mixed,
        default: []
    }, 
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    },
    
})

const Course = dbClient.model("Course", courseModal);

dbClient.collection("courses").getIndexes().then(res =>{
    dbClient.collection("courses").createIndex({"$**": "text"}).then(res => console.log(res)) 
})
module.exports = Course;

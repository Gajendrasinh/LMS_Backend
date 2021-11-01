const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const studentModel = new Schema({
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
    logo: {
        type: Schema.Types.String,
        default: ''
    },
    role: {
        type: Schema.Types.String,
        default: "student"
    },
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College',
        default: null
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
        ref: "User"
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false,
    },
    exams: {
        type: Schema.Types.Array,
        default: [],
    },
    webinars: {
        type: Schema.Types.Array,
        default: [],
    },
    badges: {
        type: Schema.Types.Array,
        default: [],
    },
    enrolledCourses: {
        type: Schema.Types.Array,
        default: [],
    }
})  

const Student = dbClient.model('Student', studentModel);
// dbClient.collection("students").dropIndex("firstname_text")
dbClient.collection("students").getIndexes().then(res =>{
    dbClient.collection("students").createIndex({"firstname": "text", "lastname": "text", "email": "text", "coursename": "text"}).then(res => console.log(res,"Student")) 
})
module.exports = Student;
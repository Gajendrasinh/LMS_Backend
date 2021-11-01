const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');


const mcqModel = new Schema({
    question: {
        type: Schema.Types.String,
        default: ""
    }, 
    answer: {
        type: Schema.Types.String,
        default: ""
    },
    marks: {
        type: Schema.Types.Number,
        default: ""
    },
    options: {
        type: [Schema.Types.Mixed]
    }
})


const essayModel = new Schema({
    question: {
        type: Schema.Types.String,
        default: ""
    }, 
    marks: {
        type: Schema.Types.Number,
        default: ""
    },
})

const examModel = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    college: {
        type: Schema.Types.ObjectId,
        ref: "College"
    },
    name: {
        type: Schema.Types.String,
        default: ""
    }, 
    attempts: {
        type: Schema.Types.Number,
        default: 1
    },
    date: {
        type: Schema.Types.String,
        default: ""
    },
    time: {
        type: Schema.Types.String,
        default: ""
    },
    total: {
        type: Schema.Types.Number,
        default: 0
    },
    examType: {
        type: Schema.Types.String,
        default: "mcq"
    }, 
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    },
    questions: [mcqModel || essayModel],
    createdAt: {
        type: Schema.Types.Date,
        default: new Date().toDateString()
    }
});

const Exam = dbClient.model("Exam", examModel);

module.exports = Exam;
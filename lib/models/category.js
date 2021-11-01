const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const SubCateogory = new Schema({
    name: {
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
const categoryModel = new Schema({
    name: {
        type: Schema.Types.String,
        default: '',
        required: true
    },
    image: {
        type: Schema.Types.String,
        default: '',
    },
    subCategory: [SubCateogory],
    createdAt: {
        type: Schema.Types.Date,
        default: '',
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    },
});

const Category = dbClient.model("Category", categoryModel);
const SubCategory = dbClient.model("SubCategory", SubCateogory);
module.exports = {Category:Category, SubCategory: SubCategory};
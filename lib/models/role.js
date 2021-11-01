const mongo = require('mongoose');
const Schema = mongo.Schema;
const dbClient = require('../database');

const roleModel = new Schema({
    name: {
        type: String,
        default: '',
        required: true
    }
})

const Role = dbClient.model('Role', roleModel);

module.exports = Role;
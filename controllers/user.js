const jwt = require('jsonwebtoken');
const userHelper = require('../helpers/user');
const config = require('../config/index');
const responseGenerator = require('../response/json-response');
class UserController {

    async register(req, res) {
        try {
            if(await userHelper.checkByEmail(req.body.email)) {
                throw new Error ('102');
            }
            const creatUser = await userHelper.register({...req.body, createdBy: req.user.id});
            responseGenerator.sendResponse(res, {message: 'User is created successfully', user: creatUser})
        } catch (error) {
           responseGenerator.sendError(res, error);
        }
    }

    async updateOwnProfile(req, res) {
        try {
            const employee = await userHelper.checkById(req.params.id);
            if(!employee) {
                throw new Error('105');
            }
            const updatedEmployee = await userHelper.update({...req.body}, req.params.id);
            responseGenerator.sendResponse(res, {message: "User is updated successfully", user: updatedEmployee});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getOwnProfile(req, res) {
        try {
            const user = await userHelper.checkById(req.params.id);
            if(!user) {
                throw new Error ('105');
            }
            responseGenerator.sendResponse(res, {user: user});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getRoles(req, res) {
        try {
            const roles = await userHelper.getRoles();
            responseGenerator.sendResponse(res, {roles})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async login(req, res) {
        try {
            let user = await userHelper.checkByEmail(req.body.email);
            if(!user) {
                throw new Error('101');
            }

            if(user.password !== req.body.password) {
                throw new Error ('101')
            }
            const role = await userHelper.getRoleById(user.role);
            const tokenBody = {
                email: user.email,
                role: role.name || 'college',
                id: user._id
            }

            delete user.role;
            user["role"] = role
            const token = await jwt.sign(tokenBody, config.secretKey, {expiresIn: '3d'});
            responseGenerator.sendResponse(res, {message: 'Login succesfully', token: token, user: user})
        } catch (error) {
            responseGenerator.sendError(res, error)
        }
    }

    async getUsers(req, res) {
        try {
            const users = await userHelper.getUsers();
            responseGenerator.sendResponse(res, {users})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }
}

module.exports = new UserController();
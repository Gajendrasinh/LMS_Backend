const mongoose = require('mongodb');
const User = require('../lib/models/user');
const Role = require('../lib/models/role');
class UserHelper {

    checkByEmail(email) {
        return new Promise((resolve, reject) => {
            try {
                const user = User.findOne({email: email})
                .populate("college", {name: 1});

                if(user) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    checkById(id) {
        return new Promise((resolve, reject) => {
            try {
                const user = User.findById(id, {password: 0}).populate('role', {name: 1, _id: 0}).populate("college", {name: 1});

                if(user) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getRoleById(id) {
        return new Promise((resolve, reject) => {
            try {
                console.log(mongoose.ObjectId(id))
                const role = Role.findById(new mongoose.ObjectId(`${id}`));

                if(role) {
                    resolve(role);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    register (body){
        return new Promise(async (resolve, reject) => {
            try {
                const userBody = {
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,
                    password: body.password,
                    gender: body.gender,
                    role: body.role,
                    college: body.college,
                    createdAt: new Date().toString(),
                    dob: body.dob,
                    dateofjoining: body.dateofjoining,
                    department: body.department,
                    coursename: body.coursename,
                    phone: body.phone,
                    address: body.address,
                    createdBy: body.createdBy
                };
                const createUser = new User(userBody);
                const data = await createUser.save();
                if(data) {
                    resolve(data)
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    update(body, id){
        return new Promise(async (resolve, reject) => {
            try {
                
                const updateUser = await User.updateOne({_id: id}, body);
               
                if ( updateUser.n > 0) {
                    resolve(await this.checkById(id));  
                } else {
                    resolve (null)
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    getRoles() {
        return new Promise((resolve, reject) =>{
            try {
                const roles = Role.find();
                if(roles) {
                    resolve(roles)
                } else {
                    resolve(null)
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            try {
                const users = User.find({}, {password: 0}).populate('role', {name: 1});
                resolve(users);
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new UserHelper();
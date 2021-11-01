const jwt = require("jsonwebtoken");
const config = require("../config");
const collegeHelper = require('../helpers/college');
const responseGenerator = require('../response/json-response');
const employeeHelper = require("../helpers/employee");
const userHelper = require("../helpers/user");
var mongoose = require('mongoose');

class CollegeController {

    async loginCollege(req, res) {
        try {
            const college = await collegeHelper.login({email: req.body.email, password: req.body.password});
            const token = jwt.sign({email: college.email, id: college._id, role: 'college'}, config.secretKey);
            responseGenerator.sendResponse(res , {message: 'College is login successfully', token: token, user: college});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getCollegeDetail(req, res) {
        try {
            const college = await collegeHelper.checkCollegeById(req.params.id);
            if(!college) {
                throw new Error('105');
            }
            responseGenerator.sendResponse(res , {user: college});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async list(req,res) {
        try {
            const {pageNumber, perPage, search} = req.query;
            const list = await collegeHelper.getCollegeList(parseInt(pageNumber ? pageNumber: 1), parseInt(perPage ? perPage: 100), search);
            responseGenerator.sendResponse(res, {college: list});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    /**
     * registerCOllege method is used to register college and insert college data in to database
     * @param {*} req 
     * @param {*} res 
     */
     async registerCollege(req, res) {
        try {
            const body = {
                ...req.body,
                createdBy: req.user.id
            }
            const college = await collegeHelper.addCollege(body);
            responseGenerator.sendResponse(res, { message: 'College is registered successfully', college: college});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async bulkUpload(req, res) {
        try {
            const body = req.body.colleges;
            const bulkUpload = await collegeHelper.bulkUpload(body, req.user.id);
            responseGenerator.sendResponse(res, { message: 'College is registered successfully', colleges: bulkUpload});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

   async updateCollege(req, res) {
        try {
            const id = req.params.id;
            if(!await collegeHelper.checkCollegeById(id)) {
                throw new Error("105");
            }
            const updatedCollege = await collegeHelper.updateCollege(req.body, id);
            if(!updatedCollege) {
                throw new Error("105")
            }
            responseGenerator.sendResponse(res, {message: 'College is updated successfully'})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async deleteCollege(req, res) {
        try {
            const id = req.params.id;
            if(!await collegeHelper.checkCollegeById(id)) {
                throw new Error("105");
            }
            const college = await collegeHelper.deleteCollege(id)
            if(!college) {
                throw new Error("Something went wrong")
            }
            responseGenerator.sendResponse(res, {message: 'College is deleted successfully'})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getDepartment(req, res){
        try {
            const collegeId = req.params.id;
            if(!await collegeHelper.checkCollegeById(collegeId)) {
                throw new Error("105");
            }
            const departments = await collegeHelper.getDeparmentsByCollegeId(collegeId);
            responseGenerator.sendResponse(res, {departments});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async bulkDeleteCollege(req, res) {
        try {
            const ids = req.body.ids;
            if(!ids && !ids.length) {
                throw new Error("110");
            }
            for(let i = 0; i < ids.length; i++) {
                if(!await collegeHelper.checkCollegeById(ids[i])) {
                    throw new Error("105");
                }
            }
            const bulkDelete = await collegeHelper.bulkDeleteCollege(ids);
            responseGenerator.sendResponse(res, {message: bulkDelete.unDeletedColleges.length > 0 ? "cannot delete particular data because its contains foreign constraints with other data": "Selected Colleges are deleted successfully", bulkDelete});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }
    
    async registerStaff(req, res) {
        try {
            if(req.user.id !== req.params.id  || req.user.id !== req.body.college) {
                throw new Error("108")
            }
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }
            const isStaffExist = await collegeHelper.checkStaffByEmailOrId(req.body.email, null);
            if(isStaffExist) {
                throw new Error("102");
            }

            const staff = await collegeHelper.registerStaff({...req.body, createdBy: req.user.id});
            responseGenerator.sendResponse(res, {message: 'Staff is registered to college', staff})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async registerStaffBulk(req, res) {
        try {
            const staff = req.body.staff;
            const getStaffRole = await userHelper.getRoles();
            console.log(getStaffRole.find(obj => obj.name === "staff"))
            const newStaffs = staff.map((obj) => {
                const tempStaff = obj;
                tempStaff['role'] =  mongoose.Types.ObjectId(getStaffRole.find(obj => obj.name === "staff")._id);
                tempStaff['college'] =  mongoose.Types.ObjectId(req.params.collegeId);
                tempStaff['createdAt'] =  new Date();
                tempStaff['createdBy'] =  req.user.id;
                return tempStaff;
            })
            const staffList = await collegeHelper.registerStaffBulk(newStaffs);
            responseGenerator.sendResponse(res, {message: 'Staff is registered to college', staff: staffList})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }
    async getStaffListFromCollege(req, res) {
        try {
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }
            const {search, perPage, pageNumber} = req.query;
            const list = await collegeHelper.getStaffListByCollege(req.params.id, parseInt(pageNumber), parseInt(perPage), search);
            responseGenerator.sendResponse(res, { staffs: list})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getStaffDetailCollege(req, res) {
        try {
            if(req.user.id !== req.params.id) {
                throw new Error("109")
            }
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }
            const list = await collegeHelper.checkStaffByEmailOrId(null,req.params.staffId);
            responseGenerator.sendResponse(res, { staffs: list})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async deleteStaffFromCollege(req,res) {
        try {
            if(req.user.id !== req.params.id) {
                throw new Error("109")
            }
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }

            if(!await collegeHelper.checkStaffByEmailOrId(null,req.params.staffId)) {
                throw new Error("105");
            }
            const deleteStaff = await collegeHelper.deleteStaffFromCollege(req.params.staffId);
            responseGenerator.sendResponse(res, {message: 'Staff is deleted sucessfully'})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getCourseList(req, res) {
        try {
            const courses = await collegeHelper.getCourseList(req.user.id);
            responseGenerator.sendResponse(res, {list: courses});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async addExam(req, res) {
        try {
            if(req.user.id !== req.params.id) {
                throw new Error("109")
            }
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }
            if(!await employeeHelper.getCourseDetail(req.body.course)) {
                throw new Error("105");
            }
            const reducer = (accumulator, currentValue) => {
                return {marks: accumulator.marks + currentValue.marks};
            }
            if(req.body.total !== req.body.questions.reduce(reducer).marks) {
                throw new Error("111");
            }
            const addedExam = await collegeHelper.addExam({...req.body, college: req.user.id});
            responseGenerator.sendResponse(res, {exam: addedExam, message: "Exam is added successfully"});
        } catch(error) {
            responseGenerator.sendError(res, error)
        }
    }

    async updateExam(req, res) {
        try {
            if(req.user.id !== req.params.id) {
                throw new Error("109")
            }
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }
            if(!await employeeHelper.getCourseDetail(req.body.course)) {
                throw new Error("105");
            }
            
            if(!await collegeHelper.getExamDetail(req.params.examId, req.user.id)) {
                throw new Error("105");
            }

            const reducer = (accumulator, currentValue) => {
                return {marks: accumulator.marks + currentValue.marks};
            }
            if(req.body.total !== req.body.questions.reduce(reducer).marks) {
                throw new Error("111");
            }

            await collegeHelper.updateExam({...req.body}, req.params.examId);
            responseGenerator.sendResponse(res, {exam: await collegeHelper.getExamDetail(req.params.examId, req.user.id), message: "Exam is updated successfully"});
        } catch(error) {
            responseGenerator.sendError(res, error)
        }
    }

    async deleteExam(req, res) {
        try {
            if(req.user.id !== req.params.id) {
                throw new Error("109")
            }
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }
            
            if(!await collegeHelper.getExamDetail(req.params.examId, req.user.id)) {
                throw new Error("105");
            }
            const addedExam = await collegeHelper.updateExam({isDeleted: true}, req.params.examId);
            responseGenerator.sendResponse(res, {exam: await collegeHelper.getExamDetail(req.params.examId, req.user.id), message: "Exam is deleted successfully"});
        } catch(error) {
            console.log(error)
            responseGenerator.sendError(res, error);
        }
    }
    async getExamsList(req, res) {

        try {
            if(req.user.id !== req.params.id  && req.user.role !== "admin") {
                throw new Error("109")
            }
            const isCollegeExist = await collegeHelper.checkCollegeById(req.params.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }
            const {type, perPage = 100, pageNumber = 1} = req.query
            const examList = await collegeHelper.getExamsList(req.user.id, type, parseInt(perPage), parseInt(pageNumber));
            responseGenerator.sendResponse(res, examList);
        
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
        
    }

    async getExamDetail(req, res) {
        try {
            const isCollegeExist = await collegeHelper.checkCollegeById(req.user.id);
            if(!isCollegeExist) {
                throw new Error("105");
            }

            const examDetail = await collegeHelper.getExamDetail(req.params.id, req.user.id);
            if(!examDetail) {
                throw new Error("105");
            }
            responseGenerator.sendResponse(res, {exam: examDetail});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async dashboard(req, res) {
        try {
            const id = req.user.id;
            const dashboardCount = await collegeHelper.dashboard(id);
            responseGenerator.sendResponse(res, {dashboard: dashboardCount});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }
}

module.exports = new CollegeController();
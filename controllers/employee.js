const employeeHelper = require("../helpers/employee");
const studentHelper = require("../helpers/student");
const userHelper = require("../helpers/user");
const responseGenerator = require("../response/json-response");
var mongoose = require('mongoose');

class EmployeeController {
    
    async addStudent(req, res) {
        try {
            const body =  {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                college: req.body.college,
                dob: req.body.dob,
                dateofjoining: req.body.dateofjoining,
                department: req.body.department,
                coursename: req.body.coursename,
                phone: req.body.phone,
                address: req.body.address,
                createdAt: new Date().toString(),
                createdBy: req.user.id
            }
            const createdStudent = await employeeHelper.addStudent(body);

            responseGenerator.sendResponse(res, {message: 'Student is created successfully', createdStudent});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

   async getStudentList(req, res) {
        try {
            const students = await studentHelper.getStudentList();
            responseGenerator.sendResponse(res, {list: students});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async createWebinar(req, res) {
        try {
            console.log(req.user, "user")
            const webinarBody = {...req.body, createdAt: new Date(), createdBy: req.user.id, status: "upcoming"}
            const createWebinar = await employeeHelper.createWebinar(webinarBody);
            responseGenerator.sendResponse(res, { message: 'Webinar is successfully created', webinar: createWebinar })
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getWebinarList(req, res) {
        try {
            const {perPage=100, pageNumber=1, status} = req.query;
            const list = await employeeHelper.getWebinarList(status, parseInt(perPage), parseInt(pageNumber) ,req.params.collegeID);
            responseGenerator.sendResponse(res, {list})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async updateWebinar(req, res) {
        try {
            const webinar = await employeeHelper.updateWebinar(req.body, req.params.id);
            responseGenerator.sendResponse(res, {message: "Webinar is updated successfully", webinar: webinar})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async createCourse(req, res) {
        try {
            const createCourse = await employeeHelper.createCourse({...req.body, createdAt: new Date(), createdBy: req.user.id})
            responseGenerator.sendResponse(res, {message: "Course is successfully created", course: createCourse})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async bulkCreateCourse(req, res) {
        try {
            const courseList = req.body.courses;
            const newBody = courseList.map((obj) => {
                const tempCourse = obj;
                tempCourse['createdAt'] = new Date();
                tempCourse['createdBy'] = req.user.id;
                tempCourse['college'] = mongoose.Types.ObjectId(req.params.collegeId);
                tempCourse['isDeleted'] = false;
                return tempCourse
            });
            const list = await employeeHelper.bulkCreateCourse(newBody);
            responseGenerator.sendResponse(res, {message: 'Course are uploaded successfully', courses: list})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async updateCourse(req, res) {
        try {
            const id = req.params.id
            if(!await employeeHelper.getCourseDetail(id)) {
                throw new Error("105");
            }
            const update = await employeeHelper.updateCourse(id, req.body);
            if(!update) {
                throw new Error("Something went wrong");
            }
            responseGenerator.sendResponse(res, {message: 'Course is updated successfully', course: update})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async deleteCourse(req, res) {
        try {
            const id = req.params.id
            if(!await employeeHelper.getCourseDetail(id)) {
                throw new Error("105");
            }
            const isDelete = await employeeHelper.deleteCourse(id);
            if(!isDelete) {
                throw new Error("Something went wrong");
            }
            responseGenerator.sendResponse(res, {message: 'Course is deleted successfully'});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getCourseList(req, res) {
        try {
            const {pageNumber, perPage, search} = req.query;
            const list = await employeeHelper.getCourseList(parseInt(pageNumber ? pageNumber: 1), parseInt(perPage ? perPage: 100), search, req.params.categoryId)
            responseGenerator.sendResponse(res, { course: list})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getCourseDetail(req, res) {
        try {
            const detail = await employeeHelper.getCourseDetail(req.params.id);

            responseGenerator.sendResponse(res, { detail: detail})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async bulkDeleteCourses(req, res) {
        try {
            const ids = req.body.ids;
            if(!ids && !ids.length) {
                throw new Error("110");
            }
            for(let i = 0; i < ids.length; i++) {
                if(!await employeeHelper.getCourseDetail(ids[i])) {
                    throw new Error("105");
                }
            } 
          const deletedIds = await employeeHelper.bulkDeleteCourse(ids);
          responseGenerator.sendResponse(res, {message: 'Selected Courses are deleted successfully', deletedIds})
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async enterMarks(req, res) {
        try {
            const studentId = req.params.studentId;
            const studentDetail = await studentHelper.getStudentDetail(studentId);
            const examDetail = studentDetail.exams.filter(exam => exam.examId == req.body.examId)[0];
            examDetail.totalMarksObtained = req.body.marks;
            const badgesEarned = studentDetail.badges || [];
            if(req.body.marks >= examDetail.total) {
                examDetail.pass = true;
                const badge = await studentHelper.getBadgeByExamId(req.body.examId);
                if(badge) {
                    badgesEarned.push(badge);
                }
                studentDetail.badges = badgesEarned;
            }
            const examIndex = studentDetail.exams.findIndex(e => e.examId == req.body.examId);
            studentDetail.exams[examIndex] = examDetail;
            const updateStudentDetail = await studentHelper.updateStudent(studentId, studentDetail);
            responseGenerator.sendResponse(res, {message: 'Marks is added Succesfully', detail: await studentHelper.getStudentDetail(studentId)});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getPendingExamList(req, res) {
        try {
            const examList = await employeeHelper.examPendingList();
            responseGenerator.sendResponse(res, {exams: examList})
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }
}

module.exports = new EmployeeController();
const responseGenerator = require("../response/json-response");
const studentHelper = require("../helpers/student");
const employeeHelper = require("../helpers/employee");
const tutorHelper = require("../helpers/tutor");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
var mongoose = require('mongoose');

class  StudentController {
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
                logo: req.body.logo,
                createdBy: req.user.id
            }
            const createdStudent = await studentHelper.addStudent(body);

            responseGenerator.sendResponse(res, {message: 'Student is created successfully', createdStudent});
        } catch (error) {
            console.log(error)
            responseGenerator.sendError(res, error);
        }
    }

    async bulkUpload(req, res) {
        try {
            const body = req.body.students;
            console.log(req.params.id)
            const students = body.map((obj) => {
                const tempObject  = obj;
                tempObject.createdAt = Date.now();
                tempObject.createdBy = req.user.id;
                tempObject.college = mongoose.Types.ObjectId(req.params.id);
                tempObject.isDeleted = false;
                return tempObject;  
            });
            console.log(students)
            const bulkStudentsUpload = await studentHelper.bulkUpload(students);
            responseGenerator.sendResponse(res, {message: 'Student is created successfully', students: bulkStudentsUpload});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getStudentList(req, res) {
        try {
            const {search, perPage, pageNumber, department, dateOfJoining} = req.query;
            const students = await studentHelper.getStudentList(search, department, parseInt(perPage ? perPage: 100), parseInt(pageNumber ? pageNumber: 1), dateOfJoining);
            responseGenerator.sendResponse(res, {students});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getStudentDetail(req, res) {
        try {
            const student = await studentHelper.getStudentDetail(req.params.id);
            if(!student) {
                throw new Error("105");
            }
            responseGenerator.sendResponse(res, {user: student});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async updateStudent(req, res) {
        try {
            const studentId =  req.params.id;
            const getStudent = await studentHelper.checkStudentById(studentId);
            if(!getStudent) {
                throw new Error("105");
            }
            const updateStudent = await studentHelper.updateStudent(studentId, req.body);
            responseGenerator.sendResponse(res, {message: 'student is updated sucessfully', updateStudent: updateStudent});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async deleteStudent(req, res) {
        try {
            const studentId =  req.params.id;
            const getStudent = await studentHelper.checkStudentById(studentId);
            if (!getStudent) {
                throw new Error("105");
            }
            if(await studentHelper.deleteStudent(studentId)) {
                responseGenerator.sendResponse(res, {message: 'Student is deleted successdully'});
            } else {
                throw new Error("something went wrong");
            }

        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async bulkDelete(req, res) {
        try {
            const ids = req.body.ids;
            if(!ids && !ids.length) {
                throw new Error("110");
            }


            for(let i = 0; i < ids.length; i++) {
                if(!await studentHelper.checkStudentById(ids[i])) {
                    throw new Error("105");
                }
            }
            const bulkDelete = await studentHelper.bulkDelete(ids);
            responseGenerator.sendResponse(res, {message: 'Selected Students are deleted successfully', bulkDelete})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async login(req, res) {
        try {
            const student = await studentHelper.checkStudentbyEmail(req.body.email)
            if(!student) {
                throw new Error('105');
            }
            if(student.password.toLowerCase() !== req.body.password.toLowerCase()) {
                throw new Error("101");
            }

            const token = await jwt.sign({
                email: student.email,
                id: student._id,
                role: 'student'
            }, config.secretKey)
            responseGenerator.sendResponse(res, {token: token, user: student});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getExamsList(req, res) {
        try {
           const {isUpcoming, perPage=100, pageNumber=1} = req.query;
           let list = await studentHelper.getExamList();
           if(isUpcoming !== "true") {
                const studentDetail = await studentHelper.getStudentDetail(req.user.id);
                let examAttepmts = [];
                list.forEach(obj => {
                    const exam = studentDetail.exams.find(ob => ob.examId == obj._id.toString());
                    if(exam) {
                        examAttepmts.push(exam)
                    }
                });
                list = examAttepmts;
            }
            const total = list.length;
            
            responseGenerator.sendResponse(res, {list: list.slice((parseInt(pageNumber) - 1) * parseInt(perPage), parseInt(pageNumber) * parseInt(perPage)), totalLength: total,pageNumber: parseInt(pageNumber), perPage: parseInt(perPage)})
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getQuestionPaper(req, res) {
        try {
            const list = await studentHelper.getQuestionPaper(req.params.id);
            responseGenerator.sendResponse(res, {questionPaper: list[0]})
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async submitQuestionPaper(req, res) {
        try {
            const body = req.body;
            const examDetail = await studentHelper.getExamDetailById(req.params.id);
            const studentDetail = await studentHelper.getStudentDetail(req.user.id);
            let examAttepmts = studentDetail.exams.filter(obj => obj.examId == req.params.id).length
            
            if(examAttepmts >= examDetail.attempts) {
                throw new Error("112")
            }
            if(!examDetail) {
                throw new Error("105");
            }
            let totalMarksObtained = 0;
            if(examDetail.examType === "mcq") {
                const questions = examDetail.questions;
                totalMarksObtained = studentHelper.calculateTotalMarks(questions, body.answers);
            }
            const examsPerformed = studentDetail.exams || [];
            const badgesEarned = studentDetail.badges || [];
            let examTaken = {
                answers: req.body.answers,
                totalMarksObtained: totalMarksObtained,
                examId: examDetail._id,
                name: examDetail.name,
                total: examDetail.total,
                pass: examDetail.total <= totalMarksObtained ? true: false,
                examDate: Date.now(),
                attempts: examAttepmts + 1,
                studentId: studentDetail._id,
                type: examDetail.examType,
            }

            if(examDetail.total <= totalMarksObtained) {
                const badge = await studentHelper.getBadgeByExamId(examDetail._id);
                if(badge) {
                    badgesEarned.push(badge);
                }
            }
            examsPerformed.push(examTaken)
            const updateStudentDetail = await studentHelper.updateStudent(req.user.id, {exams: examsPerformed, badges: badgesEarned})
            responseGenerator.sendResponse(res, {message: 'Your test is submitted succesfully', detail: await studentHelper.getStudentDetail(req.user.id)});
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getStudentDashboard(req, res) {
        try {
            const studentDetail = await studentHelper.getStudentDetail(req.user.id);
            // const examList = await studentHelper.getExamList();
            // const attendedExams = [];
            // for(let i = 0; i < studentDetail.exams.length; i++) {
            //     examList.forEach(obj => {
            //         let e = studentDetail.exams[i];
            //         if(obj._id.toString() == studentDetail.exams[i].examId) {
            //             e['examDetail'] = obj;
            //             attendedExams.push(e)
            //         }
            //     })
            // }
            // studentDetail.exams = attendedExams;
            responseGenerator.sendResponse(res, { detail: studentDetail});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }


    async getMyCourses(req, res) {
        try {
            const studentDetail = await studentHelper.getStudentDetail(req.user.id);
            responseGenerator.sendResponse(res, { list: studentDetail.enrolledCourses});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }


    async enrolledCourse(req, res) {
        try {
            const courseId = req.params.courseId;
            const studentId = req.user.id;
            const studentDetail = await studentHelper.getStudentDetail(studentId);
            const courseDetail = await employeeHelper.getCourseDetail(courseId);
            studentDetail.enrolledCourses.push(courseDetail);
            const updateStudent = await studentHelper.updateStudent(studentId, studentDetail);
            responseGenerator.sendResponse(res, {message: 'Your test is submitted succesfully', detail: await studentHelper.getStudentDetail(studentId)});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }


    async getMyEarnedBadges(req, res) {
        try {
            const studentDetail = await studentHelper.getStudentDetail(req.user.id);
            // const courses = await tutorHelper.getCourseListing({isDeleted: false});
            // const enrolledCourses = [];
            // for(let i = 0; i < studentDetail.enrolledCourses.length; i++) {
            //     courses.forEach(obj => {
            //         let e = studentDetail.enrolledCourses[i];
            //         if(obj._id.toString() == studentDetail.enrolledCourses[i]) {
            //             e['courseDetail'] = obj;
            //             enrolledCourses.push(e)
            //         }
            //     })
            // }
            // studentDetail.enrolledCourses = enrolledCourses;
            responseGenerator.sendResponse(res, { list: studentDetail.badges});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }


    async getUpcomingWebinars(req, res) {
        try {
            const {perPage, pageNumber} = req.query;
            const webinars = await employeeHelper.getWebinarList("upcoming", parseInt(perPage ? perPage: 100), parseInt(pageNumber ? pageNumber: 1));
            responseGenerator.sendResponse(res, webinars);
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }
}

module.exports = new StudentController();
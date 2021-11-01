const Student = require("../lib/models/student");
const Exam = require("../lib/models/exam");
const Badge = require("../lib/models/badge")
class StudentHelper {

    addStudent(body) {
        return new Promise(async (resolve, reject) => {
            try {
            if(await this.checkStudentbyEmail(body.email)) {
                throw new Error('104');
            }
              const createStudent = new Student({
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,
                    password: body.password,
                    college: body.college,
                    dob: body.dob,
                    dateofjoining: body.dateofjoining,
                    department: body.department,
                    coursename: body.coursename,
                    phone: body.phone,
                    address: body.address,
                    createdAt: new Date().toString(),
                    createdBy: body.createdBy,
                    isDeleted: false
                });
                const student = await createStudent.save();
                if(student) {
                    resolve(student);
                }
            } catch (error) {
                reject(error);
            }
        })
    }


    bulkUpload(body) {
        return new Promise(async(resolve, reject) => {
            try {
                const insertMany = await Student.insertMany(body);
                resolve(insertMany);
            } catch (error) {
                reject(error);
            }
        })
    }
    
    checkStudentbyEmail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const student = await Student.findOne({email: email});
                if(student && !student.isDeleted) {
                    resolve(student);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    checkStudentById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const student = await Student.findById(id);
                if(!student.isDeleted) {
                    resolve(student);
                } else {
                    resolve(null)
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    updateStudent(id, body) {
        return new Promise(async (resolve, reject) => {
            try {
                
                const updateStudent = await Student.updateOne({_id: id}, body);
                if(updateStudent.n > 0) {
                    resolve(await this.checkStudentById(id))
                } else {
                    throw new Error("Something went wrong")
                }
            } catch(error) {
                reject(error);
            }
        })
    }


    getStudentList(search, department, perPage=100, pageNumber=1, dateOfJoining) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = {}
                if ((search && search !== ""))  {
                    query = {...query, $text: {$search: new RegExp(search)}}
                }
                let student = await Student.find(query, {password: 0}).populate('college', {name: 1}).populate('createdBy', {"firstname": 1, lastname: 1})
                console.log(student)
                if(department && department !== "")  {
                    student = student.filter(ob => ob.department.toLowerCase() === department.toLowerCase());
                } else if(dateOfJoining && dateOfJoining !== "") {
                    student = student.filter(ob => ob.dateofjoining === dateOfJoining);
                }
                if(!!student.length) {
                    const total = student.filter(s => s.isDeleted !== true).length;
                    resolve({list: student.filter(s => s.isDeleted !== true).slice((pageNumber - 1) * perPage, pageNumber * perPage), totalStudents: total, pageNumber, perPage})
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    bulkDelete(ids) {
        return new Promise(async(resolve, reject) => {
            try {
                const deletedStudents = [];
                for(let i = 0; i < ids.length; i++) {
                    const data = await Student.updateOne({_id: ids[i]}, {isDeleted: true});
                    if(data.n > 0) {
                        deletedStudents.push(ids[i])
                    }
                }
                resolve(deletedStudents)
            } catch(error) {
                reject(error);
            }
        })
    }

    deleteStudent(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteStudent = await Student.updateOne({_id: id}, {isDeleted: true});
                if(deleteStudent.n > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    getExamList(perPage=100, pageNumber=1) {
        return new Promise(async (resolve, reject) => {
            try {
                // const list = await Exam.find({});
                const list = await Exam.aggregate([
                    {
                        $project: {
                            "total": 0, 
                            "questions.answer": 0,
                            "questions.marks": 0
                        }
                    },
                    {
                        $lookup: {
                            "from": "courses",
                            "localField": "course",
                            "foreignField": "_id",
                            "as": "course"
                        }
                    }
                    
                    
                ]);
                if(list.length > 0) {
                    resolve(list.filter(ob => ob.isDeleted === false))
                } else {
                    resolve([])
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getExamListByIds(ids) {
        return new Promise((resolve, reject) => {
            try {

            } catch (error) {
                reject(error);
            }
        })
    }

    getBadgeList() {
        return new Promise(async (resolve, reject) => {
            try {
                // const list = await Exam.find({});
                const list = await Badge.find({})
                if(list.length > 0) {
                    resolve(list.filter(ob => ob.isDeleted === false))
                } else {
                    resolve([])
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getQuestionPaper(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const list = await Exam.aggregate([{
                    $project: {
                        "total": 0, 
                        "questions.answer": 0,
                        "questions.marks": 0
                    }
                }]);
                if(list.length > 0) {
                    resolve(list.filter(ob => ob._id == id && ob.isDeleted === false));
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getExamDetailById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const exam = await Exam.findById(id)
                if(exam) {
                    resolve(exam);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getStudentDetail(id){
        return new Promise(async (resolve, reject) => {
            try {
                const student = await Student.findById(id);
                if(student) {
                    resolve(student)
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getBadgeByExamId(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const badge = await Badge.findOne({taskId: id});
                if(badge) {
                    resolve(badge)
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    dashboardDetails(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const student = await Student.aggregate([{
                    "lookup": {
                        "from": "$exams",
                        "foreignField": "_id",
                        "localField": "exams.examId",
                        "as": "exams"
                    }
                }]);
                resolve(student)
            } catch (error) {
                reject(error);
            }
        })
    }

    


    calculateTotalMarks(questions, answers) {
        let totalMarks = 0;
        for(let i = 0; i < questions.length; i++) {
            if(questions[i]._id == answers[i].question && questions[i].answer === answers[i].answer) {
                totalMarks+=questions[i].marks
            }
        }
        return totalMarks;
    }
}

module.exports = new StudentHelper();
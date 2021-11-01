const College = require('../lib/models/college');
const Student = require("../lib/models/student");
const User = require("../lib/models/user");
const Staff = require("../lib/models/staff");
const Exam = require("../lib/models/exam");
const Course = require("../lib/models/course");

class CollegeHelper {


    login(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const college = await College.findOne({email: body.email});
                if (!college) {
                    throw new Error('101');
                }
                if (college.password !== body.password) {
                    throw new Error('101');
                }
                delete college.password;
                // college['role'] = "college"
                resolve(college);
            } catch (error) {
                reject(error);
            }
        })
    }

    getCollegeList(pageNumber=1, perPage=100, search) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = {}
                if (search && search !== "")  {
                    query = {...query, $text: {$search: new RegExp(search)}}
                }
                const list =  await College.find(query);
                if(list) {
                    const total = list.filter(c => c.isDeleted !== true).length;
                    resolve({list: list.filter(c => c.isDeleted !== true).slice((pageNumber - 1) * perPage, pageNumber * perPage), totalLength: total, pageNumber, perPage})
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * @param {*} body contains college body json paramter
     */
     addCollege(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const createCollege = new College({
                    name: body.name,
                    email: body.email,
                    logo: body.logo,
                    phone: body.phone,
                    address: body.address,
                    noofstaffs: body.noofstaffs,
                    department: body.department,
                    createdAt: new Date().toString(),
                    createdBy: body.createdBy
                });
                const college = await createCollege.save();
                resolve(college);
            } catch (error) {
                reject(error);
            }
        })
    }

    bulkUpload(body, createdBy) {
        return new Promise(async (resolve, reject) => {
            try {
                let colleges = body.map((obj) => {
                    const tempObject = obj;
                    tempObject.createdAt = Date.now();
                    tempObject.createdBy = createdBy;
                    return tempObject
                })
                const insertMany = await College.insertMany(colleges);
                resolve(insertMany)
            } catch (error) {
                reject(error);
            }
        })
    }

    updateCollege(body, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const updated = await College.updateOne({_id: id}, body);
                if(updated.n > 0) {
                    resolve(true)
                } else {
                    resolve(false);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    checkCollegeById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const college = await College.findById(id);
                if(college){
                    resolve(college);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteCollege(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const collegeDeleted =  await College.updateOne({_id: id}, {isDeleted: true});
                if(collegeDeleted.n > 0) {
                    resolve(true)
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getDeparmentsByCollegeId(id) {
        return new Promise(async(resolve, reject) => {
            try {
                const departments = await College.findOne({_id: id}, {department: 1});
                console.log(departments);
                if(departments && !!departments.department.length) {
                    resolve(departments.department)
                } else {
                    resolve([]);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    bulkDeleteCollege(ids) {
        return new Promise(async (resolve, reject) => {
            try {
                const unDeletedColleges = [];
                const deletedColleges = [];
                for(let i = 0; i < ids.length; i++) {
                    const isContains = await this.checkCollegeContainsStudentOrEmployee(ids[i]);
                    if(isContains) {
                        unDeletedColleges.push(ids[i]);
                    } else {
                        await this.deleteCollege(ids[i]);
                        deletedColleges.push(ids[i]);
                    }
                }
                resolve({unDeletedColleges: unDeletedColleges, deletedColleges});
            } catch (error) {
                reject(error);
            }
        })
    }


    checkCollegeContainsStudentOrEmployee(id) {
        return new Promise(async(resolve,reject) => {
            try {
                const student = await Student.findOne({college: id});
                const user = await User.findOne({college: id});
                console.log(student, user)
                if(student || user) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (error) {
                reject(error);
            }
        })
    }


    registerStaff(body) {
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
                    createdBy: body.createdBy,
                    logo: body.logo,
                };

                const addStaff = new User(userBody);
                const staff = await addStaff.save();
                if(staff) {
                    resolve(staff)
                } else {
                    resolve(null)
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    registerStaffBulk(staff) {
        return new Promise(async(resolve, reject) => {
            try {
                const addedStaff = await Staff.insertMany(staff);
                resolve(addedStaff)
            } catch (error) {
                reject(error);
            }
        })
    }

    checkStaffByEmailOrId(email, id) {
        return new Promise(async(resolve, reject) => {
            try {
                let query  = {}
                if(email && !id) {
                    query = {
                        email: email,
                        isDeleted: false
                    }
                } else if(!email && id) {
                    query = {
                        _id: id,
                        isDeleted: false
                    }
                }

                const staff = await User.findOne(query);
                console.log(staff)
                if(staff) {
                    resolve(staff)
                } else {
                    resolve(null)
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getStaffListByCollege(id, pageNumber=1, perPage=100, search) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = { college: id}
                if (search && search !== "")  {
                    query = {college: id, $text: {$search: new RegExp(search)}}
                }
                const list =  await User.find(query);
                if(list) {
                    const total = list.filter(st => st.isDeleted !== true).length;
                    resolve({list: list.filter(st => st.isDeleted !== true).slice((pageNumber - 1) * perPage, pageNumber * perPage), totalLength: total, perPage, pageNumber})
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteStaffFromCollege(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = { _id: id}
                const updateStaff = await User.updateOne(query, {isDeleted: true});
                if(updateStaff.n > 0) {
                    resolve(await this.checkStaffByEmailOrId(null, id));
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getCourseList(id) {
        return new Promise(async(resolve, reject) => {
            try {
                console.log(id, "asas")
                const list = await Course.find({college: id});
                if(list) {
                    resolve(list)
                } else {
                    resolve([])
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    dashboard(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const students = await Student.find({college: id});
                const staff = await Staff.find({college: id});
                const courses = await Course.find({college: id});
                console.log(students.length, staff.length, courses.length);
                resolve({students: students, studentCount: students.length, staffs: staff, staffCount: staff.length, courses: courses, courseCount: courses.length });
            } catch (error) {
                reject(error);
            }
        })
    }


    addExam(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const exam = new Exam(body);
                const savedExam = await exam.save();
                if(savedExam) {
                    resolve(savedExam);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    updateExam(body, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const exam = await Exam.updateOne({_id: id},body);
                   
                if(exam && exam.n > 0) {
                    resolve(exam);
                } else {
                    resolve(null)
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getExamsList(collegeId, type, perPage, pageNumber) {
        return new Promise(async(resolve, reject) => {
            try {
                const list = await Exam.find({college: collegeId, examType: type}).skip((pageNumber - 1) * perPage).limit(perPage);
                if(list) {
                    const total = list.filter(ob => ob.isDeleted === false).length;
                    resolve({exams: list.filter(ob => ob.isDeleted === false),  totalLength: total, perPage, pageNumber});
                   
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getExamDetail (id, collegeId) {
        return new Promise(async( resolve, reject) => {
            try {
                const exam = await Exam.findOne({_id: id, college: collegeId});
                if(exam) {
                    resolve(exam)
                } else {
                    resolve(null)
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    checkExamById (id) {
        return new Promise(async( resolve, reject) => {
            try {
                const exam = await Exam.findOne({_id: id});
                if(exam) {
                    resolve(exam)
                } else {
                    resolve(null)
                }
            } catch(error) {
                reject(error);
            }
        })
    }


}


module.exports = new CollegeHelper();
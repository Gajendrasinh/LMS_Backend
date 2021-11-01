const Student = require("../lib/models/student");
const Webinar = require("../lib/models/webinar");
const Course = require("../lib/models/course");
const studentHelper = require("../helpers/student");
const mongoose = require('mongoose');
class EmployeeHelper {

    addStudent(body) {
        return new Promise(async (resolve, reject) => {
            try {
            if(await studentHelper.checkStudentbyEmail(body.email)) {
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
                    createdBy: body.createdBy
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


    createWebinar(webinarBody) {
        return new Promise(async (resolve, reject) => {
            try {
                const createWebinare = new Webinar(webinarBody);
                resolve(await createWebinare.save());
            } catch (error) {
                reject(error);
            }
        })
    }

    updateCourse(id, body) {
        return new Promise(async(resolve, reject) => {
            try {
                const updateCourse = await Course.updateOne({_id: id}, body);
                if(updateCourse.n > 0) {
                    resolve(await this.getCourseDetail(id))
                } else {
                    resolve(null)
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    deleteCourse(id){
        return new Promise(async(resolve, reject) => {
            try {
                const isDeleteCourse = await Course.deleteOne({_id: id});
                if (isDeleteCourse.n > 0) {
                    resolve(true);
                } else {
                    resolve(null)
                }
            } catch (error) { 
                reject(error);
            }
        })
    }

    getWebinarList(status, perPage=100, pageNumber=1, collegeID) {
        return new Promise(async (resolve, reject) => {
            try {
                const validStatus = ['upcoming', 'completed', 'ongoing']
                if(!validStatus.includes(status.toLowerCase())) {
                    throw new Error('106')
                }
                const webinars = await Webinar.find({status: status, college: collegeID});
                if(webinars.length > 0) {
                    const total = webinars.length;
                    resolve({list: webinars.slice((pageNumber - 1) * perPage, pageNumber * perPage), totalLength: total, perPage, pageNumber});
                } else {
                    resolve([])
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    updateWebinar(body, id) {
        return new Promise(async (resolve, reject) => {
            try {
                if(!await this.getWebinarById(id)) {
                    throw new Error('105');
                } 
                const webinars = await Webinar.updateOne({_id: id}, body);
                if(webinars.n > 0) {
                    resolve(await this.getWebinarById(id));
                } else {
                    resolve(null)
                }
            } catch (error) {
                reject(error);
            }
        })
    }


    getWebinarById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const webinars = await Webinar.findById(id);
                if(webinars) {
                    resolve(webinars);
                } else {
                    resolve(null)
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    createCourse(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const createCourse = new Course({
                    name: body.name,
                    description: body.description,
                    logo: body.logo,
                    createdAt: body.createdAt,
                    college: body.college,
                    createdBy: body.createdBy,
                    file: body.file,
                    category: body.category,
                    subCategory: body.subCategory,
                    price: body.price,
                    discount: body.discount,
                    chapters: body.chapters
                });
                const course = await createCourse.save();
                if(course) {
                    resolve(course)
                }

            } catch(error) {
                reject(error);
            }
        })
    }

    bulkCreateCourse (list) {
        return new Promise(async( resolve, reject) => {
            try {
                const insertMany = await Course.insertMany(list);
                resolve(insertMany);
            } catch (error) {
                reject(error);
            }
        })
    }

    getCourseList(pageNumber=1, perPage=100, search, categoryId) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = {}
               if (search && search !== "")  {
                query = {...query, $text: {$search: new RegExp(search)}}
               }
                const list = await Course.find(query).populate("college", {name: 1, department: 1})
              
                if(list.length > 0) {
                    const total = list.filter(co => co.isDeleted !== true && co.category == categoryId).length;
                    resolve({list: list.filter(co => co.isDeleted !== true && co.category == categoryId).slice((pageNumber - 1) * perPage, pageNumber * perPage), totalLength: total, perPage, pageNumber});
                } else {
                    resolve([]);
                }

            } catch(error) {
                reject(error);
            }
        })
    }

    getCourseDetail(id){
        return new Promise(async (resolve, reject) => {
            try {
                const detail = await Course.findById(id).populate("college", {name: 1, department: 1});
                if(!detail.isDeleted) {
                    resolve(detail);
                } else {
                    throw new Error("105");
                }

            } catch(error) {
                reject(error);
            }
        })
    }

    bulkDeleteCourse(ids){
        return new Promise(async (resolve, reject) => {
            try {
                const deletedCourses = [];
                for(let i = 0; i < ids.length; i++) {
                    const data = await Course.updateOne({_id: ids[i]}, {isDeleted: true});
                    if(data.n > 0) {
                        deletedCourses.push(ids[i])
                    }
                }
                resolve(deletedCourses)
            } catch(error) {
                reject(error);
            }
        })
    }

    examPendingList() {
        return new Promise(async (resolve, reject) => {
            try {

                const studentList = await Student.find({}, {exams: 1, _id: 0})
                const examList = [].concat.apply([], studentList);
                const combineExams = []
                examList.map(obj => {
                    obj.exams.forEach(ob => {
                        if(ob.type && ob.type !=="mcq" && ob.totalMarksObtained == 0) {
                            combineExams.push(ob);
                        }
                    })
                })
                resolve(combineExams);
            } catch(error) {
                reject(error);
            }
        })
    }


}

module.exports = new EmployeeHelper();
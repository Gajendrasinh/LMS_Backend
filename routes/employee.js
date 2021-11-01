const express = require('express');
const router = express.Router();
const employeeController = require("../controllers/employee");
const userController = require("../controllers/user")
const routesValidator = require("../validators/route-validators");

router.post("/:id", routesValidator.verifyUser, userController.updateOwnProfile);
router.post("/student/add", routesValidator.verifyUser, employeeController.addStudent);
router.get("/student/list", routesValidator.verifyUser, employeeController.getStudentList);
router.post("/webinar/add", routesValidator.verifyUser, employeeController.createWebinar);
router.post("/student/exam/marks/:studentId", routesValidator.verifyUser, employeeController.enterMarks)
router.get("/webinar/:collegeID/list", routesValidator.verifyUser, employeeController.getWebinarList);
router.put("/webinar/:id", routesValidator.verifyUser, employeeController.updateWebinar);
router.post("/course/add", routesValidator.verifyUser, employeeController.createCourse);
router.post("/course/bulk/add/:collegeId", routesValidator.verifyUser, employeeController.bulkCreateCourse);
router.put("/course/:id", routesValidator.verifyUser, employeeController.updateCourse);
router.delete("/course/:id", routesValidator.verifyUser, employeeController.deleteCourse);
router.get("/course/list/:categoryId", routesValidator.verifyUser, employeeController.getCourseList);
router.delete("/course/bulk/list", routesValidator.verifyUser, employeeController.bulkDeleteCourses);
router.get("/course/:id", routesValidator.verifyUser, employeeController.getCourseDetail);
router.get("/exam/pending/list", routesValidator.verifyUser, employeeController.getPendingExamList);
module.exports = router;

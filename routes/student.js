const express = require('express');
const router = express.Router();
const routesValidator = require("../validators/route-validators");

const studentController = require("../controllers/student");
router.post('/bulk/upload/:id', routesValidator.verifyAuthorizedPerson, studentController.bulkUpload);
router.post('/add', routesValidator.verifyAuthorizedPerson, studentController.addStudent);
router.post('/login', studentController.login);
router.get('/list', routesValidator.verifyAuthorizedPerson, studentController.getStudentList);
router.get('/dashboard', routesValidator.verifyStudent, studentController.getStudentDashboard);
router.get('/list/exam', routesValidator.verifyStudent, studentController.getExamsList);
router.get('/list/webinar',  studentController.getUpcomingWebinars);
router.post('/course/enrolle/:courseId', routesValidator.verifyStudent, studentController.enrolledCourse)
router.get('/list/mycourse',  routesValidator.verifyStudent,studentController.getMyCourses);
router.get('/list/badges',  routesValidator.verifyStudent,studentController.getMyEarnedBadges);
router.get('/exam-paper/:id', routesValidator.verifyStudent, studentController.getQuestionPaper);
router.post('/exam-paper/:id', routesValidator.verifyStudent, studentController.submitQuestionPaper);
router.delete('/:id', routesValidator.verifyAuthorizedPerson, studentController.deleteStudent);
router.delete('/bulk/list', routesValidator.verifyAuthorizedPerson, studentController.bulkDelete)
router.get('/:id', studentController.getStudentDetail);
router.put('/:id', routesValidator.verifyStudent, studentController.updateStudent);
module.exports = router;

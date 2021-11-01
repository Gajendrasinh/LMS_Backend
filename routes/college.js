const express = require('express');
const routesValidator = require("../validators/route-validators");
const collegeController = require('../controllers/college');
const studentController = require("../controllers/student")
const router = express.Router();

router.get('/list', collegeController.list);
router.get('/dashboard', routesValidator.verifyAuthorizedPerson, collegeController.dashboard);
router.get('/courses', routesValidator.verifyAuthorizedPerson, collegeController.getCourseList);
router.post('/add', routesValidator.verifyAuthorizedPerson, collegeController.registerCollege);
router.post('/bulk/upload', routesValidator.verifyAuthorizedPerson, collegeController.bulkUpload);
router.post('/login', collegeController.loginCollege);
router.put('/:id', routesValidator.verifyAuthorizedPerson, collegeController.updateCollege);
router.delete('/:id', routesValidator.verifyAuthorizedPerson, collegeController.deleteCollege);
router.get('/:id', routesValidator.verifyAuthorizedPerson, collegeController.getCollegeDetail);
router.post('/students/add', studentController.addStudent);
router.get('/students/list', studentController.getStudentList);
router.get("/:id/departments", collegeController.getDepartment);
router.delete('/bulk/list',  routesValidator.verifyAuthorizedPerson, collegeController.bulkDeleteCollege);
router.post('/:id/staff', routesValidator.verifyAuthorizedPerson, collegeController.registerStaff);
router.post('/bulk/upload/:collegeId/staff', routesValidator.verifyAuthorizedPerson, collegeController.registerStaffBulk);
router.get('/:id/staff/list', routesValidator.verifyAuthorizedPerson, collegeController.getStaffListFromCollege);
router.get('/:id/staff/:staffId', routesValidator.verifyAuthorizedPerson, collegeController.getStaffDetailCollege);
router.delete('/:id/staff/:staffId', routesValidator.verifyAuthorizedPerson, collegeController.deleteStaffFromCollege);
router.post('/:id/exam', routesValidator.verifyAuthorizedPerson, collegeController.addExam);
router.put('/:id/exam/:examId', routesValidator.verifyAuthorizedPerson, collegeController.updateExam);
router.delete('/:id/exam/:examId', routesValidator.verifyAuthorizedPerson, collegeController.deleteExam);
router.get('/exam/:id', routesValidator.verifyAuthorizedPerson, collegeController.getExamDetail);
router.get('/:id/exams', routesValidator.verifyAuthorizedPerson, collegeController.getExamsList);

module.exports = router;

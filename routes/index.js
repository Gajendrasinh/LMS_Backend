const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const studentRoutes = require('./student');
const employeeRoutes = require('./employee');
const userRoutes = require('./user');
const tutorRoutes = require("./tutor");
const collegeRoutes = require('./college');
const routeValidators = require('../validators/route-validators');
const fileRouter = require("./upload");

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/student', studentRoutes);
router.use('/employee', employeeRoutes);
router.use('/college', collegeRoutes);
router.use('/tutor', tutorRoutes);
router.use('/upload', fileRouter);
module.exports = router;

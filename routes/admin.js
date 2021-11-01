const express = require('express');
const adminController = require('../controllers/admin');
const collegeController = require('../controllers/college');
const router = express.Router();
const routeValidator = require("../validators/route-validators");

router.post('/college', collegeController.registerCollege);
router.post('/category', adminController.addCategory);
router.post('/feedback', adminController.addFeedback);
router.get('/category/list', adminController.listCategory);
router.get('/feedback/list', adminController.listFeedback);
router.post('/badge', routeValidator.verifyAuthorizedPerson ,adminController.addBadge);
router.get('/badges' ,adminController.badgesList);
router.get('/badge/:id' ,adminController.getBadgeDetail);
router.put('/badge/:id', routeValidator.verifyAuthorizedPerson ,adminController.updateBadge);
router.delete('/badge/:id', routeValidator.verifyAuthorizedPerson ,adminController.deleteBadge);
module.exports = router;

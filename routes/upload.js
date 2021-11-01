const express = require('express');
const router = express.Router();
const uploadController = require("../controllers/upload");

router.post("/file", uploadController.uploadFile)
router.get("/file", uploadController.downloadFile)
module.exports = router;
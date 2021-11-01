const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `documents/${req.query.folder}`);
	},
	filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
           + path.extname(file.originalname))
          // file.fieldname is name of the field (image)
          // path.extname get the uploaded file extension
  }
});

const upload = multer({
	storage: storage,
    fileFilter: (req, file, cb) => {
        // upload only mp4 and mkv format
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|png|jpg|pdf|PNG|doc|docx|txt)$/)) { 
           return cb(new Error('Please upload a valid file'))
        }
        cb(undefined, true)
    }
}).any();

module.exports = upload;
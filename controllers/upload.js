const fileupload = require("../helpers/file-upload");
const responseGenerator = require("../response/json-response");
const path = require("path")
class UploadController {
    
    uploadFile(req, res) {
        try {
            fileupload(req, res, (err) =>{
                if(err) {
                    responseGenerator.sendError(res, err);
                }  else {
                    if(req.files && req.files[0]) {
                        responseGenerator.sendResponse(res, {message: 'file is successfully uploaded', filename: req.files[0].filename, path: req.files[0].path})
                    } else {
                        responseGenerator.sendError(res, err);
                    }
                }
            });
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    downloadFile(req, res) {
        try {
            const filepath = req.query.path;
            console.log(path.resolve(filepath))
            res.sendFile(path.resolve(filepath))
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }
}

module.exports = new UploadController();
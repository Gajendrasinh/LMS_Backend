const constants = require('./constant');
class ResponseGenerator {

    sendError(res, err) {
        if(err.message && constants[err.message]) {
            res.status(constants[err.message].status);
            res.send({status: 'failed', responseCode: constants[err.message].status, message: constants[err.message].message});
        } else {
            res.status(500);
            res.send({status: 'failed', responseCode: 500, message: err.message});
        }
    }

    sendResponse(res, data) {
        res.send({status: 'success', responseCode: 200, data });
    }
}

module.exports = new ResponseGenerator();
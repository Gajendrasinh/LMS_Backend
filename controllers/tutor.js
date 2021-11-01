const tutorHelper = require("../helpers/tutor");
const responseGenerator = require("../response/json-response");
class TutorController {
    async courseList(req, res) {
        try {
            let id = {isDeleted:  false};
            const {search, perPage = 100, pageNumber = 1} = req.query
            const list = await tutorHelper.getCourseListing(id, parseInt(perPage), parseInt(pageNumber));
            responseGenerator.sendResponse(res, list);
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async courseListByTutorId(req, res) {
        try {
            let id = {createdBy: req.user.id, isDeleted: false};
            const list = await tutorHelper.getCourseListing(id);
            responseGenerator.sendResponse(res, {list: list});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async addTutorial(req, res) {
        try {
            const body = req.body;
            const addedTutorial = await tutorHelper.addTutorial({...body, createdBy: req.user.id, createdAt: Date.now()});
            responseGenerator.sendResponse(res, {message: 'Tutorial is added successfully', tutorial: addedTutorial});
        } catch(error) {
            console.log(error)
            responseGenerator.sendError(res, error);
        }
    }

    async updateTutorial(req, res) {
        try {
            const body = req.body;
            const addedTutorial = await tutorHelper.updateTutorial(body, req.params.id);
            responseGenerator.sendResponse(res, {message: 'Tutorial is updated successfully', tutorial: addedTutorial});
        } catch(error) {
            console.log(error)
            responseGenerator.sendError(res, error);
        }
    }

    async deleteTutorial(req, res) {
        try {
            const body = req.body;
            const addedTutorial = await tutorHelper.deleteTutorial(req.params.id);
            responseGenerator.sendResponse(res, {message: 'Tutorial is deleted successfully', tutorial: addedTutorial});
        } catch(error) {
            console.log(error)
            responseGenerator.sendError(res, error);
        }
    }
}

module.exports = new TutorController();
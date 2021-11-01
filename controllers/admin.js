const adminHelper = require('../helpers/admin');
const responseGenerator = require('../response/json-response');
const examHelper = require("../helpers/college");
const tutorHelper = require("../helpers/tutor")
class AdminController {

    /**
     * registerCOllege method is used to register college and insert college data in to database
     * @param {*} req 
     * @param {*} res 
     */
    async registerCollege(req, res) {
        try {
            const body = {
                ...req.body,
                createdBy: req.user.id
            }
            const college = await adminHelper.addCollege(body);
            responseGenerator.sendResponse(res, { message: 'College is registered successfully', college: college});
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async addBadge(req, res) {
        try {
            let taskDetail = null;
            if(req.body.badgeType === "exam") {
                taskDetail = await examHelper.checkExamById(req.body.taskId);
            } else {
                taskDetail = await tutorHelper.findTutorialById(req.body.taskId);
            }

            if(!taskDetail) {
                throw new Error("105");
            }
            const badge = await adminHelper.addBadge({...req.body, createdBy: req.user.id, createdAt: Date.now()})

            responseGenerator.sendResponse(res, {message: 'Badge is added successfully', badge})

        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async badgesList(req, res) {
        try {
            const {pageNumber, perPage, search} = req.query;
            const list = await adminHelper.badgeList(parseInt(pageNumber ? pageNumber: 1), parseInt(perPage ? perPage: 100))

            responseGenerator.sendResponse(res, { list})

        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async updateBadge(req, res) {
        try {
            let taskDetail = null;
            if(req.body.badgeType === "exam") {
                taskDetail = await examHelper.checkExamById(req.body.taskId);
            } else {
                taskDetail = await tutorHelper.findTutorialById(req.body.taskId);
            }

            if(!taskDetail) {
                throw new Error("105");
            }

            if(!await adminHelper.findBadgeById(req.params.id)) {
                throw new Error("105");
            }
            const list = await adminHelper.editBadge(req.params.id, req.body)

            responseGenerator.sendResponse(res, { message: 'Badge is updated successfully',  badge: list})

        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async deleteBadge(req, res) {
        try {

            if(!await adminHelper.findBadgeById(req.params.id)) {
                throw new Error("105");
            }
            const list = await adminHelper.editBadge(req.params.id, {isDeleted: true})

            responseGenerator.sendResponse(res, { message: 'Badge is deleted successfully',  badge: list})

        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async getBadgeDetail(req, res) {
        try {
            let badgeDetail = await adminHelper.findBadgeById(req.params.id)

            if(!badgeDetail) {
                throw new Error("105");
            }
            let returnedTarget = {}
            if(badgeDetail.badgeType === "exam") {
                
                const examDetail = await examHelper.checkExamById(badgeDetail.taskId);
                returnedTarget = { exam: {
                    name: examDetail.name,
                    duration: examDetail.time,
                }
            };

            } else {
                const tutorialDetail = await tutorHelper.findTutorialById(badgeDetail.taskId);
                returnedTarget = { tutorial: {
                        name: tutorialDetail.name,
                        description: tutorialDetail.description,
                        duration: tutorialDetail.duration
                    }
                };

            }
            responseGenerator.sendResponse(res, { badge: badgeDetail, taskDetail: returnedTarget})

        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async addCategory(req, res) {
        try {
            const {isCategory} = req.query;
           
            const addCategory = await adminHelper.addCategory(req.body, isCategory);
            responseGenerator.sendResponse(res, {category: addCategory, message: 'Category has been added succesfully'})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async listCategory(req, res) {
        try {
            const {value} = req.query;
            const list = await adminHelper.listCategory(req.body);
            responseGenerator.sendResponse(res, {list: value==="names" ? list.map(obj => {return {name:obj.name, id: obj._id, icon: obj.image}}): list})
        } catch (error) {
            responseGenerator.sendError(res, error);
        }
    }

    async addFeedback(req,res) {
        try {
            const addFeedback = await adminHelper.addFeedback(req.body);
            responseGenerator.sendResponse(res, {feedback: addFeedback, message: 'Feedback has been added succesfully'})
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }

    async listFeedback(req,res) {
        try {
            const {pageNumber = 1, perPage = 100} = req.query;
            const list = await adminHelper.listFeedback(parseInt(pageNumber), parseInt(perPage));
            responseGenerator.sendResponse(res, list)
        } catch(error) {
            responseGenerator.sendError(res, error);
        }
    }
}

module.exports = new AdminController();
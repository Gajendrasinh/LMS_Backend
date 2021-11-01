const jwt = require('jsonwebtoken');
const responseGenerator = require("../response/json-response");
const config = require('../config/index');
class UserValidator {


    /**
     * @param {*} req contains request parameters
     * @param {*} res contains res parameters to send response
     * @param {*} next is next callback
     */
     verifyUser (req, res, next) {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                throw new Error('103');
            }

            if (token) {
                const user = jwt.decode(token);
                req.user = user;
                next();
            }

        } catch (error) {
            if (config.excludePaths.includes(req.originalUrl)) {
               next(); 
            } else {
                responseGenerator.sendError(res, error);
            }
        }
    }

    /**
     * @param {*} req contains request parameters
     * @param {*} res contains res parameters to send response
     * @param {*} next is next callback
     */
     verifyAuthorizedPerson (req, res, next) {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                throw new Error('103');
            }

            if (token) {
                const user = jwt.decode(token);
                if (!user || !config.authenticatedPersonRoles.includes(user.role)) {
                    throw new Error('103');
                } else {
                    req.user = user;
                    next();
                }
            }

        } catch (error) {
            if (config.excludePaths.includes(req.originalUrl)) {
               next(); 
            } else {
                responseGenerator.sendError(res, error);
            }
        }
    }

    /**
     * @param {*} req contains request parameters
     * @param {*} res contains res parameters to send response
     * @param {*} next is next callback
     */
    verifyAdmin (req, res, next) {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                throw new Error('103');
            }

            if (token) {
                const user = jwt.decode(token);
                if (user.role !== "admin") {
                    throw new Error('103');
                } else {
                    req.user = user;
                    next();
                }
            }

        } catch (error) {
            if (config.excludePaths.includes(req.originalUrl)) {
               next(); 
            } else {
                responseGenerator.sendError(res, error);
            }
        }
    }

    /**
     * @param {*} req contains request parameters
     * @param {*} res contains res parameters to send response
     * @param {*} next is next callback
     */
     verifyStudent (req, res, next) {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                throw new Error('103');
            }

            if (token) {
                const user = jwt.decode(token);
                if (user.role !== "student") {
                    throw new Error('103');
                } else {
                    req.user = user;
                    next();
                }
            }

        } catch (error) {
            if (config.excludePaths.includes(req.originalUrl)) {
               next(); 
            } else {
                responseGenerator.sendError(res, error);
            }
        }
    }

    /**
     * @param {*} req contains request parameters
     * @param {*} res contains res parameters to send response
     * @param {*} next is next callback
     */
     verifyCollege (req, res, next) {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                throw new Error('103');
            }

            if (token) {
                const user = jwt.decode(token);
                if (user.role !== "colllege") {
                    throw new Error('103');
                } else {
                    req.user = user;
                    next();
                }
            }

        } catch (error) {
            if (config.excludePaths.includes(req.originalUrl)) {
               next(); 
            } else {
                responseGenerator.sendError(res, error);
            }
        }
    }
}

module.exports = new UserValidator();
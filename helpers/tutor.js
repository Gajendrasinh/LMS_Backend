const Tutorial = require("../lib/models/tutorial");

class TutorHelper {

    addTutorial(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const tutorial = new Tutorial(body);

                const addedTutorial = await tutorial.save()
                if(addedTutorial) {
                    resolve(addedTutorial)
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    findTutorialById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const tutorial = await Tutorial.findOne({_id: id});
                if(tutorial) {
                    resolve(tutorial)
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    updateTutorial(body, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const tutorial = await Tutorial.updateOne({_id: id}, body);

                if(tutorial && tutorial.n > 0) {
                    resolve(await this.findTutorialById(id));
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    deleteTutorial(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const tutorial = await Tutorial.updateOne({_id: id}, {isDeleted: true});

                if(tutorial && tutorial.n > 0) {
                    resolve(await this.findTutorialById(id));
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    getCourseListing (id, perPage = 100, pageNumber = 1) {
        return new Promise(async (resolve, reject) => {
            try {
                const tutorials = await Tutorial.find(id);
                if(tutorials && tutorials.length > 0) {
                    const total = tutorials.length;
                    resolve({list: tutorials.slice((pageNumber - 1) * perPage, pageNumber * perPage), totalLength: total, pageNumber, perPage});
                } else {
                    resolve(null)
                }
            } catch(error) {
                reject(error);
            }
        })
    }
}

module.exports = new TutorHelper();
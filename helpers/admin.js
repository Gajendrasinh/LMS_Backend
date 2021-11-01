const College = require('../lib/models/college');
const Badge = require('../lib/models/badge');
const {Category, SubCategory} = require('../lib/models/category');
const Feedback = require('../lib/models/feedback');
class AdminHelper {

    /**
     * @param {*} body contains college body json paramter
     */
    addCollege(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const createCollege = new College({
                    name: body.name,
                    email: body.email,
                    logo: body.logo,
                    phone: body.phone,
                    address: body.address,
                    noofstaffs: body.noofstaffs,
                    department: body.department,
                    createdAt: new Date().toString(),
                    createdBy: body.createdBy
                });
                const college = await createCollege.save();
                resolve(college);
            } catch (error) {
                reject(error);
            }
        })
    }

    addBadge(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const badge = new Badge(body);
                const addedBadge = await badge.save();
                if(addedBadge) {
                    resolve(addedBadge);
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    badgeList(pageNumber, perPage) {
        return new Promise(async (resolve, reject) => {
            try {
                const badges = await Badge.find({isDeleted: false});
                if(badges.length > 0) {
                    resolve(badges.slice((pageNumber - 1) * perPage, pageNumber * perPage).filter(ob => ob.isDeleted === false));
                } else {
                    resolve([]);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    findBadgeById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const badge = await Badge.findById(id);
                if(badge) {
                    resolve(badge);
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    editBadge(id, body) {
        return new Promise(async (resolve, reject) => {
            try {
                const badges = await Badge.updateOne({_id: id} , body);
                if(badges.n > 0) {
                    resolve(await this.findBadgeById(id));
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    findCategoryById(id) {
        return new Promise(async(resolve, reject) => {
            try {
                const category = await Category.findOne({_id: id});
                if(category) {
                    resolve(category);
                } else {
                    resolve(null);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    addCategory(body, isCategory) {
        return new Promise(async(resolve, reject) => {
            try {
                let category = {};
                if(isCategory == "true") {
                    const catBody = new Category({
                        name: body.name,
                        subCategory: [new SubCategory({
                            name: body.subCategory,
                        })],
                        createdAt: Date.now(),
                        image: body.image,
                        isDeleted: false
                    });
                    category = await catBody.save();
                    if(category) {
                        resolve(category);
                    }
                    return;
                } else if(isCategory != "true" && body.id && body.id !=="") {
                    const addedCategory = await this.findCategoryById(body.id);
                    const oldSubCategories = addedCategory.subCategory;
                    const newSubCategory = new SubCategory({
                        name: body.subCategory,
                    })
                    oldSubCategories.push(newSubCategory);
                    category = await Category.updateOne({_id: body.id}, {subCategory: oldSubCategories});
                    if(category.n > 0) {
                        resolve(await this.findCategoryById(body.id));
                    }
                } else {
                    throw new Error('112')
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    listCategory() {
        return new Promise(async(resolve, reject) => {
            try {
                const list = await Category.find({});
                if(list.length > 0) {
                    resolve(list)
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    addFeedback(body) {
        return new Promise(async(resolve, reject) => {
            try {
                const feedBackBody = new Feedback({
                    name: body.name,
                    type: body.type,
                    email: body.email,
                    comment: body.comment,
                    createdAt: Date.now()
                });
                const feedback = await feedBackBody.save();
                if(feedback) {
                    resolve(feedback);
                }
            } catch(error) {
                reject(error);
            }
        })
    }

    listFeedback(pageNumber = 1, perPage=100) {
        return new Promise(async(resolve, reject) => {
            try {
                const feedbacks = await Feedback.find({}).sort({createdAt: -1});
                
                if(feedbacks.length > 0) {
                    const total = feedbacks.length;
                    resolve({list: feedbacks.slice((pageNumber - 1) * perPage, pageNumber * perPage).filter(ob => ob.isDeleted === false), totalLength: total, pageNumber: pageNumber, perPage: perPage});
                } else {
                    resolve([])
                }
            } catch(error) {
                reject(error);
            }
        })
    }
}

module.exports = new AdminHelper();
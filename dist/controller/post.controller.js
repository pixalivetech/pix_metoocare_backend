"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharePost = exports.updatePostReport = exports.updatePostBlockUsers = exports.createPostComments = exports.savePostLikes = exports.getFilterPostByUser = exports.getFilterPost = exports.getSinglePost = exports.deletePost = exports.updatePost = exports.savePost = exports.getAllPost = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const post_model_1 = require("../model/post.model");
const notification_controller_1 = require("./notification.controller");
var activity = "Post";
/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Post.
 */
let getAllPost = async (req, res, next) => {
    try {
        const data = await post_model_1.Post.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Post', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Post', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllPost = getAllPost;
/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create Post.
 */
let savePost = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const postDetails = req.body;
            let date = new Date();
            postDetails.date = date?.getDate();
            postDetails.month = date?.getMonth() + 1;
            postDetails.year = date?.getFullYear();
            const createData = new post_model_1.Post(postDetails);
            let insertData = await createData.save();
            if (postDetails.mention) {
                postDetails.mention.map(id => {
                    const data = { from: { user: postDetails.userId, modelType: 'user' }, to: { user: id, modelType: 'user' }, description: 'Mention your name', title: 'Mention' };
                    (0, notification_controller_1.saveNotification)(data);
                });
            }
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Post', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Post', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Post', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.savePost = savePost;
/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Post.
 */
let updatePost = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const postDetails = req.body;
            let updateData = await post_model_1.Post.findByIdAndUpdate({ _id: postDetails._id }, {
                $set: {
                    video: postDetails.video,
                    content: postDetails.content,
                    title: postDetails.title,
                    hashtag: postDetails.hashtag,
                    mention: postDetails.mention,
                    type: postDetails.type,
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Post', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Post', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Post', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updatePost = updatePost;
/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Post.
 */
let deletePost = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await post_model_1.Post.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Post', true, 200, data, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Post', true, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deletePost = deletePost;
/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get single Post.
 */
let getSinglePost = async (req, res, next) => {
    try {
        const data = await post_model_1.Post.findById({ _id: req.query._id }).populate('comment.userId', { name: 1, image: 1 }).populate('userId', { image: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-SinglePost', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-SinglePost', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSinglePost = getSinglePost;
/**
@author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter Post.
 */
let getFilterPost = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.doctorId) {
            andList.push({ doctorId: req.body.doctorId });
        }
        if (req.body.title) {
            andList.push({ title: req.body.title });
        }
        if (req.body.content) {
            andList.push({ content: req.body.content });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const postList = await post_model_1.Post.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('doctorId', { name: 1 });
        const postCount = await post_model_1.Post.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Filter-Post', true, 200, { postList, postCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Filter-Post', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterPost = getFilterPost;
/**
@author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter Post.
 */
let getFilterPostByUser = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const postList = await post_model_1.Post.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('userId', { name: 1, profileImage: 1, }).populate('comment.user', { name: 1, profileImage: 1, }).populate('likes.user', { name: 1, profileImage: 1, }).populate('doctorId', { doctorName: 1, profileImage: 1, });
        const postCount = await post_model_1.Post.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPostForWeb', true, 200, { postList, postCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPostForWeb', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterPostByUser = getFilterPostByUser;
/**
 @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create Likes.
 */
let savePostLikes = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const postDetails = req.body;
            const postLikeDetails = await post_model_1.Post.findOne({ $and: [{ 'likes.user': postDetails.likes.user }, { _id: postDetails._id }] });
            if (postLikeDetails) {
                const deleteLikes = await post_model_1.Post.findByIdAndUpdate({ _id: postDetails._id }, {
                    $pull: { likes: postDetails.likes },
                    $inc: { likeCount: -1 }
                });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-PostLikes', true, 200, deleteLikes, ErrorMessage_1.clientError.success.deleteSuccess);
            }
            else {
                const updateLikes = await post_model_1.Post.findByIdAndUpdate({ _id: postDetails._id }, {
                    $push: { likes: postDetails.likes },
                    $inc: { likeCount: 1 }
                });
                if (updateLikes && updateLikes.userId) {
                    if (updateLikes.userId.valueOf() !== postDetails.likes.user) {
                        var data;
                        if (postDetails.likes.modelType === 'User') {
                            data = { from: { user: postDetails.likes.user, modelType: 'User' }, to: { user: updateLikes.userId, modelType: 'Master' }, description: 'Like your post', title: 'Like' };
                        }
                        if (postDetails.likes.modelType === 'Master') {
                            data = { from: { user: postDetails.likes.user, modelType: 'Master' }, to: { user: updateLikes.userId, modelType: 'Master' }, description: 'Like your post', title: 'Like' };
                        }
                        (0, notification_controller_1.saveNotification)(data);
                    }
                }
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-PostLikes', true, 200, updateLikes, ErrorMessage_1.clientError.success.savedSuccessfully);
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-PostLikes', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-PostLikes', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.savePostLikes = savePostLikes;
/**
@author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save post comments.
 **/
let createPostComments = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            req.body.comment.createdOn = new Date();
            const postDetails = req.body;
            let updateData = await post_model_1.Post.findByIdAndUpdate({ _id: req.body._id }, {
                $inc: { commentCount: 1 },
                $addToSet: {
                    comment: req.body.comment,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            });
            if (updateData && updateData.userId) {
                if (updateData.userId.valueOf() !== req.body.comment.user) {
                    var data;
                    if (req.body.comment.modelType === 'User') {
                        data = { from: { user: req.body.comment.user, modelType: 'User' }, to: { user: updateData.userId, modelType: 'Master' }, description: 'Comment your post', title: 'Comment' };
                    }
                    if (req.body.comment.modelType === 'Master') {
                        data = { from: { user: req.body.comment.user, modelType: 'Master' }, to: { user: updateData.userId, modelType: 'Master' }, description: 'Comment your post', title: 'Comment' };
                    }
                    (0, notification_controller_1.saveNotification)(data);
                }
            }
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-PostComments', true, 200, updateData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-PostComments', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-PostComments', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createPostComments = createPostComments;
/**
 * @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update block Users.
 */
let updatePostBlockUsers = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const postDetails = req.body;
            let updateData = await post_model_1.Post.findByIdAndUpdate({ _id: req.body._id }, {
                $addToSet: {
                    block: postDetails.block,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-BlockUser', true, 200, updateData, 'Hide successfully');
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-BlockUser', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-BlockUser', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updatePostBlockUsers = updatePostBlockUsers;
/**
 * @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save post report.
 */
let updatePostReport = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            req.body.report.createdOn = new Date();
            const postDetails = req.body;
            let postReport = await post_model_1.Post.findByIdAndUpdate({ _id: postDetails._id }, {
                $push: {
                    report: postDetails.report,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'update-PostReport', true, 200, postReport, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'update-PostReport', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'update-PostReport', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updatePostReport = updatePostReport;
/**
 * @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to share post
 */
let sharePost = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const postDetails = req.body;
            const { _id } = postDetails._id;
            const originalPost = await post_model_1.Post.findById(_id);
            const sharePost = await post_model_1.Post.create({ originalPost: originalPost, userId: postDetails.userId, createdOn: new Date() });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Share-Post', true, 200, sharePost, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Share-Post', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
};
exports.sharePost = sharePost;
//# sourceMappingURL=post.controller.js.map
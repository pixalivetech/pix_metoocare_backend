"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterDoctorReview = exports.getDoctorReviews = exports.updateDoctorReview = exports.deleteDoctorReview = exports.getSingleDoctorReview = exports.getAllDoctorReview = exports.saveDoctorReview = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const doctorReview_model_1 = require("../model/doctorReview.model");
var activity = "DoctorReview";
/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save DoctorReview.
 */
let saveDoctorReview = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DoctorReviewDetails = req.body;
            const createData = new doctorReview_model_1.DoctorReview(DoctorReviewDetails);
            const insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-DoctorReview', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-DoctorReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-DoctorReview', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveDoctorReview = saveDoctorReview;
/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get All DoctorReview.
 */
let getAllDoctorReview = async (req, res, next) => {
    try {
        const DoctorReviewDetails = await doctorReview_model_1.DoctorReview.find({ isDeleted: false }).populate('userId', { name: 1, profileImage: 1 }).sort({ createdAt: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-DoctorReview', true, 200, DoctorReviewDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-DoctorReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllDoctorReview = getAllDoctorReview;
/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single DoctorReview.
 */
let getSingleDoctorReview = async (req, res, next) => {
    try {
        const DoctorReviewDetails = await doctorReview_model_1.DoctorReview.findOne({ _id: req.query._id }).populate('doctorId', { doctorName: 1 }).populate('userId', { name: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-DoctorReview', true, 200, DoctorReviewDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-DoctorReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleDoctorReview = getSingleDoctorReview;
/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete DoctorReview.
 */
let deleteDoctorReview = async (req, res, next) => {
    try {
        const DoctorReviewDetails = await doctorReview_model_1.DoctorReview.findOneAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: Date.now(),
                modifiedBy: req.user._id
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-DoctorReview', true, 200, DoctorReviewDetails, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-DoctorReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteDoctorReview = deleteDoctorReview;
/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update DoctorReview.
 */
let updateDoctorReview = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DoctorReviewDetails = req.body;
            const updateData = await doctorReview_model_1.DoctorReview.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    title: DoctorReviewDetails.title,
                    comment: DoctorReviewDetails.comment,
                    rating: DoctorReviewDetails.rating,
                    modifiedOn: Date.now(),
                    modifiedBy: req.user._id
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-DoctorReview', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-DoctorReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-DoctorReview', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateDoctorReview = updateDoctorReview;
/**
* @author Santhosh Khan K
* @date   03-01-2024
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get DoctorReviews.
*/
const getDoctorReviews = async (req, res, next) => {
    try {
        const userAppointments = await doctorReview_model_1.DoctorReview.find({ doctorId: req.query.doctorId, isDeleted: false }).populate('userId').limit(10).sort({ createdAt: -1 }).skip(0);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-UserAppointments', true, 200, userAppointments, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-UserAppointments', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getDoctorReviews = getDoctorReviews;
/**
* @author Santhosh Khan K
* @date   03-01-2024
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get Filter DoctorReview.
*/
let getFilterDoctorReview = async (req, res, next) => {
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
        if (req.body.userId) {
            andList.push({ userId: req.body.userId });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const reviewList = await doctorReview_model_1.DoctorReview.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('doctorId', { doctorName: 1 }).populate("userId", { name: 1 });
        const reviewCount = await doctorReview_model_1.DoctorReview.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterDoctorReview', true, 200, { reviewList, reviewCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterDoctorReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterDoctorReview = getFilterDoctorReview;
//# sourceMappingURL=doctorReview.controller.js.map
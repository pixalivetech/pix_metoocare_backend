"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterPanelReview = exports.updatePanelReview = exports.deletePanelReview = exports.getSinglePanelReview = exports.getAllPanelReview = exports.savePanelReview = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const panelReview_model_1 = require("../model/panelReview.model");
var activity = "PanelReview";
/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save PanelReview.
 */
let savePanelReview = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const panelReviewDetails = req.body;
            const createData = new panelReview_model_1.PanelReview(panelReviewDetails);
            const insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-PanelReview', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-PanelReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-PanelReview', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.savePanelReview = savePanelReview;
/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get All PanelReview.
 */
let getAllPanelReview = async (req, res, next) => {
    try {
        const panelReviewDetails = await panelReview_model_1.PanelReview.find({ isDeleted: false }).sort({ createdAt: -1 }).populate('panelId', { companyName: 1, profileImage: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-PanelReview', true, 200, panelReviewDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-PanelReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllPanelReview = getAllPanelReview;
/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single PanelReview.
 */
let getSinglePanelReview = async (req, res, next) => {
    try {
        const panelReviewDetails = await panelReview_model_1.PanelReview.findOne({ _id: req.query._id }).populate('panelId', { companyName: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-PanelReview', true, 200, panelReviewDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-PanelReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSinglePanelReview = getSinglePanelReview;
/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete PanelReview.
 */
let deletePanelReview = async (req, res, next) => {
    try {
        const { modifiedBy, modifiedOn } = req.body;
        const panelReviewDetails = await panelReview_model_1.PanelReview.findOneAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: Date.now(),
                modifiedBy: modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-PanelReview', true, 200, panelReviewDetails, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-PanelReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deletePanelReview = deletePanelReview;
/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update PanelReview.
 */
let updatePanelReview = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const panelReviewDetails = req.body;
            const updateData = await panelReview_model_1.PanelReview.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    title: panelReviewDetails.title,
                    comment: panelReviewDetails.comment,
                    rating: panelReviewDetails.rating,
                    modifiedBy: panelReviewDetails.modifiedBy,
                    modifiedOn: Date.now()
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-PanelReview', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-PanelReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-PanelReview', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updatePanelReview = updatePanelReview;
let getFilterPanelReview = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.userId) {
            andList.push({ userId: req.body.userId });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const panelReviewList = await panelReview_model_1.PanelReview.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('panelId', { companyName: 1 });
        const panelReviewCount = await panelReview_model_1.PanelReview.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPanelReview', true, 200, { panelReviewList, panelReviewCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPanelReview', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterPanelReview = getFilterPanelReview;
//# sourceMappingURL=panelReview.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFaq = exports.deleteFaq = exports.getFilterFaq = exports.getSingleUser = exports.replydoctor = exports.saveFaq = void 0;
const express_validator_1 = require("express-validator");
const faq_models_1 = require("../model/faq.models");
const doctor_model_1 = require("../model/doctor.model");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const notification_1 = require("../utils/notification");
const mongoose = require("mongoose");
var activity = 'Faq';
/**
 * @author BalajiMurahari
 * @date 06-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to  doctor answer to users questions
 */
const saveFaq = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const { question, userId } = req.body;
            const availableDoctors = await doctor_model_1.Doctor.find({ isDeleted: false }, '_id');
            const doctorIds = availableDoctors.map((doctor) => doctor._id);
            const newQuestion = new faq_models_1.Faq({ question, userId, doctorIds });
            await newQuestion.save();
            for (const doctorId of doctorIds) {
                try {
                    await (0, commonResponseHandler_1.notifyDoctor)(doctorId, question, userId);
                }
                catch (notifyError) {
                    console.error('Error notifying doctor:', notifyError);
                }
            }
            const responsePayload = {
                ...newQuestion.toObject(),
                doctorIds,
            };
            (0, commonResponseHandler_1.response)(req, res, 'Save-Faq', 'Level-2', 'Save-Faq', true, 200, responsePayload, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, 'Save-Faq', 'Level-3', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, 'Save-Faq', 'Level-3', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveFaq = saveFaq;
/**
 * @author BalajiMurahari
 * @date 08-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to doctor reply to users questions
 */
const replydoctor = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Reply-To-Question', 'Level-3', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
            // return;
        }
        const faqDetails = req.body;
        const { _id, doctorId, answer } = faqDetails;
        const faq = await faq_models_1.Faq.findById(_id);
        if (!faq) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Reply-To-Question', 'Level-3', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Faq not found');
            return;
        }
        const doctorIdAsObjectId = new mongoose.Types.ObjectId(doctorId.toString());
        const doctor = await doctor_model_1.Doctor.findById(doctorIdAsObjectId);
        if (!doctor) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Reply-To-Question', 'Level-3', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Doctor not found');
            return;
        }
        faq.answer = answer;
        await faq.save();
        try {
            await (0, notification_1.notifyUser)(faq.userId.toString(), answer, doctorIdAsObjectId.toString());
        }
        catch (notifyError) {
            console.error('Error sending notification:', notifyError.message);
        }
        const responsePayload = {
            faqId: _id,
            answer,
            doctorId,
        };
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Reply-To-Question', true, 200, responsePayload, ErrorMessage_1.clientError.success.replySentSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Reply-To-Question', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.replydoctor = replydoctor;
/**
* @author Balaji Murahari
* @date 06-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get a single Users.
*/
let getSingleUser = async (req, res, next) => {
    try {
        const faqData = await faq_models_1.Faq.findById({ _id: req.query._id }).populate('userId', { name: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-SingleFaq', true, 200, faqData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-SingleFaq', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleUser = getSingleUser;
/**
 * @author Balaji Murahari
 * @date 08-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filtered .
 */
let getFilterFaq = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        andList.push({ user: req.body.loginId });
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const faqList = await faq_models_1.Faq.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('userId', { name: 1 }).populate('doctorId', { doctorName: 1 });
        const faqCount = await faq_models_1.Faq.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-FilteredFaq', true, 200, { faqList, faqCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilteredFaq', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterFaq = getFilterFaq;
/**
 * @author BalajiMurahari
 * @date 06-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to  delete user.
 */
let deleteFaq = async (req, res, next) => {
    try {
        const { modifiedBy, modifiedOn } = req.body;
        const faq = await faq_models_1.Faq.findByIdAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedBy: modifiedBy,
                modifiedOn: modifiedOn
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Faq', true, 200, faq, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Faq', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteFaq = deleteFaq;
/**
 * @author Santhosh Khan K
 * @date 11-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all user
 */
let getAllFaq = async (req, res, next) => {
    try {
        const userList = await faq_models_1.Faq.find({ isDeleted: false }).populate('userId', { name: 1 }).populate('doctorId', { name: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-AllUser', true, 200, userList, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-AllUser', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllFaq = getAllFaq;
//# sourceMappingURL=faq.controller.js.map
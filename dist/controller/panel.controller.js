"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallPanelProfile = exports.getFilteredPanel = exports.updatePanel = exports.deletePanel = exports.getProfileDetails = exports.getSinglePanel = exports.getallPanel = exports.savePanel = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const panel_model_1 = require("../model/panel.model");
const users_model_1 = require("../model/users.model");
const company_model_1 = require("../model/company.model");
const doctor_model_1 = require("../model/doctor.model");
const TokenManager = require("../utils/tokenManager");
var activity = "Panel";
/**
 *
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Panel
 */
let savePanel = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const panelData = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const usersData = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const companyData = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const doctorData = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!panelData && !usersData && !companyData && !doctorData) {
                const panelDetails = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                panelDetails.otp = otp;
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new panel_model_1.Panel(panelDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                });
                const result = {};
                result['_id'] = insertData._id;
                result["otp"] = otp;
                let finalResult = {};
                finalResult["loginType"] = 'panel';
                finalResult["panelDetails"] = result;
                finalResult["token"] = token;
                (0, commonResponseHandler_1.sendEmailOtp)(insertData.email, insertData.otp);
                (0, commonResponseHandler_1.sendEmail)(insertData.email, insertData.otp);
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Panel', true, 200, result, ErrorMessage_1.clientError.otp.otpSent);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Panel', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Panel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Panel ', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.savePanel = savePanel;
/**
 *
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Panel
 */
let getallPanel = async (req, res, next) => {
    try {
        const panel = await panel_model_1.Panel.find({ isDeleted: false }).select('image');
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Panel', true, 200, panel, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Panel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getallPanel = getallPanel;
/**
 *
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Panel
 */
let getSinglePanel = async (req, res, next) => {
    try {
        const panel = await panel_model_1.Panel.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-Panel', true, 200, panel, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Panel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSinglePanel = getSinglePanel;
/**
 *
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Profile Details
 */
let getProfileDetails = async (req, res, next) => {
    try {
        const panel = await panel_model_1.Panel.findById({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-ProfileDetails-Panel', true, 200, panel, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-ProfileDetails-Panel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getProfileDetails = getProfileDetails;
/**
 *
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Panel
 */
let deletePanel = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        const panel = await panel_model_1.Panel.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Panel', true, 200, panel, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Panel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deletePanel = deletePanel;
/**
 *
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Panel
 */
let updatePanel = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const panelDetail = req.body;
            const updateData = await panel_model_1.Panel.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: panelDetail.email,
                    name: panelDetail.name,
                    mobileNumber: panelDetail.mobileNumber,
                    profileImage: panelDetail.profileImage,
                    companyName: panelDetail.companyName,
                    companyAddress: panelDetail.companyAddress,
                    typesOfBusiness: panelDetail.typesOfBusiness,
                    city: panelDetail.city,
                    state: panelDetail.state,
                    modifiedOn: panelDetail.modifiedOn,
                    modifiedBy: panelDetail.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Panel', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Panel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Panel', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updatePanel = updatePanel;
/**
 *
 * @author Santhosh Khan K
 * @date   08-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered Panel
 */
let getFilteredPanel = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.email) {
            andList.push({ email: req.body.email });
        }
        if (req.body.name) {
            andList.push({ name: req.body.name });
        }
        if (req.body.companyName) {
            andList.push({ companyName: req.body.companyName });
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber });
        }
        if (req.body.gender) {
            andList.push({ gender: req.body.gender });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        var panelList = await panel_model_1.Panel.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page);
        var panelCount = await panel_model_1.Panel.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterUser', true, 200, { panelList, panelCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterUser', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredPanel = getFilteredPanel;
/**
 * @author Santhosh Khan K
 * @date   10-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get All Panel Profile
 */
let getallPanelProfile = async (req, res, next) => {
    try {
        const panel = await panel_model_1.Panel.find({ isDeleted: false }).select('profileImage').limit(8);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Panel', true, 200, panel, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Panel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getallPanelProfile = getallPanelProfile;
//# sourceMappingURL=panel.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredUser = exports.updateUser = exports.deleteUser = exports.getProfileDetails = exports.getSingleUser = exports.getAllUser = exports.saveUsers = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const users_model_1 = require("../model/users.model");
const panel_model_1 = require("../model/panel.model");
const company_model_1 = require("../model/company.model");
const doctor_model_1 = require("../model/doctor.model");
const TokenManager = require("../utils/tokenManager");
var activity = "Users";
/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save users
 */
let saveUsers = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const usersData = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const panelData = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const companyData = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const doctorData = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!usersData && !panelData && !companyData && !doctorData) {
                const usersDetails = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                usersDetails.otp = otp;
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new users_model_1.Users(usersDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                });
                const result = {};
                result['_id'] = insertData._id;
                result["otp"] = otp;
                let finalResult = {};
                finalResult["loginType"] = 'users';
                finalResult["usersDetails"] = result;
                finalResult["token"] = token;
                (0, commonResponseHandler_1.sendEmailOtp)(insertData.email, insertData.otp);
                //sendEmail(insertData.email,insertData.otp)
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Users', true, 200, result, ErrorMessage_1.clientError.otp.otpSent);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Users', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Users', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Users ', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveUsers = saveUsers;
/**
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all user
 */
let getAllUser = async (req, res, next) => {
    try {
        const user = await users_model_1.Users.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-user', true, 200, user, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-user', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllUser = getAllUser;
/**
 *
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single user
 */
let getSingleUser = async (req, res, next) => {
    try {
        const user = await users_model_1.Users.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-user', true, 200, user, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-user', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleUser = getSingleUser;
/**
 *
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single user
 */
let getProfileDetails = async (req, res, next) => {
    try {
        const user = await users_model_1.Users.findById({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-ProfileDetails-User', true, 200, user, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-ProfileDetails-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
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
 * @description This Function is used to delete user
 */
let deleteUser = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        const user = await users_model_1.Users.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-user', true, 200, user, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-user', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteUser = deleteUser;
/**
 *
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update user
 */
let updateUser = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const userDetail = req.body;
            const updateData = await users_model_1.Users.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: userDetail.email,
                    name: userDetail.name,
                    fullName: userDetail.fullName,
                    mobileNumber: userDetail.mobileNumber,
                    profileImage: userDetail.profileImage,
                    gender: userDetail.gender,
                    address: userDetail.address,
                    city: userDetail.city,
                    state: userDetail.state,
                    pincode: userDetail.pincode,
                    landmark: userDetail.landmark,
                    alternativeMobileNumber: userDetail.alternativeMobileNumber,
                    locality: userDetail.locality,
                    useMyCurretAddress: userDetail.useMyCurretAddress,
                    modifiedOn: userDetail.modifiedOn,
                    modifiedBy: userDetail.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-User', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-User', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateUser = updateUser;
/**
 *
 * @author Santhosh Khan K
 * @date   08-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered user
 */
let getFilteredUser = async (req, res, next) => {
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
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber });
        }
        if (req.body.gender) {
            andList.push({ gender: req.body.gender });
        }
        if (req.body.city) {
            andList.push({ city: req.body.city });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        var userList = await users_model_1.Users.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page);
        var userCount = await users_model_1.Users.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterUser', true, 200, { userList, userCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterUser', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredUser = getFilteredUser;
//# sourceMappingURL=users.controller.js.map
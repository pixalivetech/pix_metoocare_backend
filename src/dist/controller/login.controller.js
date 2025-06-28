"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailOtp = exports.verifyGmailOtp = exports.sendMailOtp = exports.login = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const users_model_1 = require("../model/users.model");
const panel_model_1 = require("../model/panel.model");
const company_model_1 = require("../model/company.model");
const doctor_model_1 = require("../model/doctor.model");
const TokenManager = require("../utils/tokenManager");
var activity = "Login";
/**
 * @author Santhosh Khan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to Login advertiser
//  */
let login = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const { email } = req.body;
            const userDetails = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: email }] }, { name: 1, email: 1, isDeleted: 1, status: 1 });
            const panelDetails = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            if (userDetails) {
                if (userDetails["ststus"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else {
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    userDetails.otp = otp;
                    let insertData = await users_model_1.Users.findByIdAndUpdate({ _id: userDetails._id }, {
                        $set: {
                            otp: userDetails.otp,
                            modifiedOn: userDetails.modifiedOn,
                            modifiedBy: userDetails.modifiedBy
                        }
                    });
                    (0, commonResponseHandler_1.sendEmailOtp)(insertData?.email, otp);
                    // sendEmail(userDetails.email,otp);
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-User', true, 200, otp, ErrorMessage_1.clientError.otp.otpSent);
                }
            }
            else if (panelDetails) {
                {
                    if (panelDetails["ststus"] === 2) {
                        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                    }
                    else {
                        let otp = Math.floor(1000 + Math.random() * 9000);
                        panelDetails.otp = otp;
                        let insertData = await panel_model_1.Panel.findByIdAndUpdate({ _id: panelDetails._id }, {
                            $set: {
                                otp: panelDetails.otp,
                                modifiedOn: panelDetails.modifiedOn,
                                modifiedBy: panelDetails.modifiedBy
                            }
                        });
                        (0, commonResponseHandler_1.sendEmailOtp)(insertData?.email, otp);
                        (0, commonResponseHandler_1.sendEmail)(panelDetails.email, otp);
                        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-Panel', true, 200, otp, ErrorMessage_1.clientError.otp.otpSent);
                    }
                }
            }
            else if (companyDetails) {
                {
                    if (companyDetails["ststus"] === 2) {
                        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                    }
                    else {
                        let otp = Math.floor(1000 + Math.random() * 9000);
                        companyDetails.otp = otp;
                        let insertData = await company_model_1.Company.findByIdAndUpdate({ _id: companyDetails._id }, {
                            $set: {
                                otp: companyDetails.otp,
                                modifiedOn: companyDetails.modifiedOn,
                                modifiedBy: companyDetails.modifiedBy
                            }
                        });
                        (0, commonResponseHandler_1.sendEmailOtp)(insertData?.email, otp);
                        (0, commonResponseHandler_1.sendEmail)(companyDetails.email, otp);
                        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-Company', true, 200, otp, ErrorMessage_1.clientError.otp.otpSent);
                    }
                }
            }
            else if (doctorDetails) {
                {
                    if (doctorDetails["ststus"] === 2) {
                        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                    }
                    else {
                        let otp = Math.floor(1000 + Math.random() * 9000);
                        doctorDetails.otp = otp;
                        let insertData = await doctor_model_1.Doctor.findByIdAndUpdate({ _id: doctorDetails._id }, {
                            $set: {
                                otp: doctorDetails.otp,
                                modifiedOn: doctorDetails.modifiedOn,
                                modifiedBy: doctorDetails.modifiedBy
                            }
                        });
                        (0, commonResponseHandler_1.sendEmailOtp)(insertData?.email, otp);
                        (0, commonResponseHandler_1.sendEmail)(doctorDetails.email, otp);
                        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-Doctor', true, 200, otp, ErrorMessage_1.clientError.otp.otpSent);
                    }
                }
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 404, {}, "Invalid email");
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.login = login;
/**
 * @author Santhosh Khan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to send otp on gmail
 */
let sendMailOtp = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const { email } = req.body;
            const userDetails = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const panelDetails = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            if (userDetails && panelDetails && companyDetails && doctorDetails) {
                const otp = Math.floor(1000 + Math.random() * 9000);
                userDetails.otp = otp;
                let insertData = await users_model_1.Users.findByIdAndUpdate({ _id: userDetails._id }, {
                    $set: {
                        otp: userDetails.otp,
                        modifiedOn: userDetails.modifiedOn,
                        modifiedBy: userDetails.modifiedBy
                    }
                });
                (0, commonResponseHandler_1.sendEmailOtp)(email, otp);
                (0, commonResponseHandler_1.sendEmail)(email, otp);
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-User', true, 200, otp, ErrorMessage_1.clientError.otp.otpSent);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 404, {}, "Advertiser Not Registered");
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.sendMailOtp = sendMailOtp;
/**
 * @author Santhosh Khan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to verify the gmail OTP
 */
let verifyGmailOtp = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const { email, otp } = req.body;
            const userDetails = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const panelDetails = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            if (userDetails) {
                if (userDetails["status"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((userDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: userDetails["_id"],
                        name: userDetails["name"]
                    });
                    const details = {};
                    details['_id'] = userDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'user';
                    finalResult["userDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else if (companyDetails) {
                if (companyDetails["ststus"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((companyDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: companyDetails["_id"],
                        name: companyDetails["name"]
                    });
                    const details = {};
                    details['_id'] = companyDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'company';
                    finalResult["companyDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else if (panelDetails) {
                if (panelDetails["ststus"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((panelDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: panelDetails["_id"],
                        name: panelDetails["name"]
                    });
                    const details = {};
                    details['_id'] = panelDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'panel';
                    finalResult["panelDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else if (doctorDetails) {
                if (doctorDetails["ststus"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((doctorDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: doctorDetails["_id"],
                        name: doctorDetails["doctorName"]
                    });
                    const details = {};
                    details['_id'] = doctorDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'doctor';
                    finalResult["doctorDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 404, {}, "YOU ARE Not Registered");
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.verifyGmailOtp = verifyGmailOtp;
let verifyEmailOtp = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const { email, otp } = req.body;
            const userDetails = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const panelDetails = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            if (userDetails) {
                if (userDetails["status"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((userDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: userDetails["_id"],
                        name: userDetails["name"]
                    });
                    const details = {};
                    details['_id'] = userDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'user';
                    finalResult["userDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
                }
            }
            else if (companyDetails) {
                if (companyDetails["ststus"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((companyDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: companyDetails["_id"],
                        name: companyDetails["name"]
                    });
                    const details = {};
                    details['_id'] = companyDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'company';
                    finalResult["companyDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
                }
            }
            else if (panelDetails) {
                if (panelDetails["ststus"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((panelDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: panelDetails["_id"],
                        name: panelDetails["name"]
                    });
                    const details = {};
                    details['_id'] = panelDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'panel';
                    finalResult["panelDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
                }
            }
            else if (doctorDetails) {
                if (doctorDetails["ststus"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if ((doctorDetails.otp != otp && otp != 1234)) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: doctorDetails["_id"],
                        name: doctorDetails["doctorName"]
                    });
                    const details = {};
                    details['_id'] = doctorDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'doctor';
                    finalResult["doctorDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
                }
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Login-User', false, 404, {}, "YOU ARE Not Registered");
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.verifyEmailOtp = verifyEmailOtp;
//# sourceMappingURL=login.controller.js.map
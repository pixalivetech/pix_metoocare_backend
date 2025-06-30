"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCompany = exports.getProfileDetails = exports.updateCompany = exports.deleteCompany = exports.getSingleCompany = exports.getAllCompany = exports.saveCompany = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const company_model_1 = require("../model/company.model");
const panel_model_1 = require("../model/panel.model");
const doctor_model_1 = require("../model/doctor.model");
const users_model_1 = require("../model/users.model");
const TokenManager = require("../utils/tokenManager");
var activity = "Company";
/**
 *
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Company
 */
let saveCompany = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const CompanyData = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const doctorData = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const panelData = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const usersData = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!CompanyData && !doctorData && !panelData && !usersData) {
                const CompanyDetails = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                CompanyDetails.otp = otp;
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new company_model_1.Company(CompanyDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                });
                const result = {};
                result['_id'] = insertData._id;
                result["otp"] = otp;
                let finalResult = {};
                finalResult["loginType"] = 'Company';
                finalResult["CompanyDetails"] = result;
                finalResult["token"] = token;
                (0, commonResponseHandler_1.sendEmailOtp)(insertData.email, insertData.otp);
                (0, commonResponseHandler_1.sendEmail)(insertData.email, insertData.otp);
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Company', true, 200, result, ErrorMessage_1.clientError.otp.otpSent);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Company', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Company', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Company ', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveCompany = saveCompany;
/**
 *
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Company
 */
let getAllCompany = async (req, res, next) => {
    try {
        const companyData = await company_model_1.Company.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Company', true, 200, companyData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Company', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCompany = getAllCompany;
/**
 *
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Company
 */
let getSingleCompany = async (req, res, next) => {
    try {
        const companyData = await company_model_1.Company.findById({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-Company', true, 200, companyData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Company', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCompany = getSingleCompany;
/**
 *
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Company
 */
let deleteCompany = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        const companyData = await company_model_1.Company.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Company', true, 200, companyData, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Company', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCompany = deleteCompany;
/**
 *
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Company
 */
let updateCompany = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const companyDetail = req.body;
            const updateData = await company_model_1.Company.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: companyDetail.email,
                    name: companyDetail.name,
                    companyName: companyDetail.companyName,
                    mobileNumber: companyDetail.mobileNumber,
                    profileImage: companyDetail.profileImage,
                    companyAddress: companyDetail.companyAddress,
                    typesOfBusiness: companyDetail.typesOfBusiness,
                    city: companyDetail.city,
                    state: companyDetail.state,
                    modifiedOn: companyDetail.modifiedOn,
                    modifiedBy: companyDetail.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Company', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Company', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Company', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateCompany = updateCompany;
/**
 *
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Company
 */
let getProfileDetails = async (req, res, next) => {
    try {
        const company = await company_model_1.Company.findById({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-ProfileDetails-User', true, 200, company, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-ProfileDetails-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getProfileDetails = getProfileDetails;
/**
 *
 * @author Santhosh Khan K
 * @date   08-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered Company
 */
let getFilteredCompany = async (req, res, next) => {
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
        var companyList = await company_model_1.Company.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page);
        var companyCount = await company_model_1.Company.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterUser', true, 200, { companyList, companyCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterUser', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCompany = getFilteredCompany;
//# sourceMappingURL=company.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctorQualification = exports.deleteDoctorExperience = exports.updateDoctorExperience = exports.updateDoctorQualification = exports.doctorReview = exports.getAllDoctorProfile = exports.createDoctorAppointment = exports.getAllDoctorCount = exports.getFilteredDoctor = exports.updateDoctor = exports.deleteDoctor = exports.getProfileDetails = exports.getSingleDoctor = exports.getAllDoctor = exports.saveDoctors = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const doctor_model_1 = require("../model/doctor.model");
const panel_model_1 = require("../model/panel.model");
const users_model_1 = require("../model/users.model");
const company_model_1 = require("../model/company.model");
const commonResponseHandler_2 = require("../helper/commonResponseHandler");
const TokenManager = require("../utils/tokenManager");
var activity = "Doctor";
/**
 *
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Doctor
 */
let saveDoctors = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const doctorData = await doctor_model_1.Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const panelData = await panel_model_1.Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const usersData = await users_model_1.Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const companyData = await company_model_1.Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!doctorData && !panelData && !usersData && !companyData) {
                const doctorDetails = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                doctorDetails.otp = otp;
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new doctor_model_1.Doctor(doctorDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["doctorName"],
                });
                const result = {};
                result['_id'] = insertData._id;
                result["otp"] = otp;
                let finalResult = {};
                finalResult["loginType"] = 'doctor';
                finalResult["doctorDetails"] = result;
                finalResult["token"] = token;
                (0, commonResponseHandler_2.sendEmailOtp)(insertData.email, insertData.otp);
                (0, commonResponseHandler_2.sendEmail)(insertData.email, insertData.otp);
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Doctor', true, 200, result, ErrorMessage_1.clientError.otp.otpSent);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Doctor', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Doctor', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Doctor ', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveDoctors = saveDoctors;
/**
 *
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Doctor
 */
let getAllDoctor = async (req, res, next) => {
    try {
        const DoctorData = await doctor_model_1.Doctor.find({ isDeleted: false }).sort({ createdAt: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Doctor', true, 200, DoctorData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Doctor', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllDoctor = getAllDoctor;
/**
 *
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Doctor
 */
let getSingleDoctor = async (req, res, next) => {
    try {
        const DoctorData = await doctor_model_1.Doctor.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-Doctor', true, 200, DoctorData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Doctor', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleDoctor = getSingleDoctor;
/**
 *
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Doctor ProfileDetails
 */
let getProfileDetails = async (req, res, next) => {
    try {
        const DoctorData = await doctor_model_1.Doctor.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-Doctor', true, 200, DoctorData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Doctor', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getProfileDetails = getProfileDetails;
/**
 *
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Doctor
 */
let deleteDoctor = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        const DoctorData = await doctor_model_1.Doctor.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Doctor', true, 200, DoctorData, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Doctor', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteDoctor = deleteDoctor;
/**
 *
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Doctor
 */
let updateDoctor = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DoctorDetail = req.body;
            const updateData = await doctor_model_1.Doctor.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: DoctorDetail.email,
                    phone: DoctorDetail.phone,
                    doctorBio: DoctorDetail.doctorBio,
                    profileImage: DoctorDetail.profileImage,
                    gender: DoctorDetail.gender,
                    doctorName: DoctorDetail.doctorName,
                    overAllExperience: DoctorDetail.overAllExperience,
                    overAllQualification: DoctorDetail.overAllQualification,
                    address: DoctorDetail.address,
                    landLineNumber: DoctorDetail.landLineNumber,
                    language: DoctorDetail.language,
                    pincode: DoctorDetail.pincode,
                    specialization: DoctorDetail.specialization,
                    services: DoctorDetail.services,
                    city: DoctorDetail.city,
                    state: DoctorDetail.state,
                    modifiedOn: DoctorDetail.modifiedOn,
                    modifiedBy: DoctorDetail.modifiedBy
                }, $addToSet: {
                    experience: DoctorDetail.experience,
                    qualification: DoctorDetail.qualification,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Doctor', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Doctor', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Doctor', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateDoctor = updateDoctor;
/**
 * @author Santhosh Khan K
 * @date   17-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered Doctor
 */
let getFilteredDoctor = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        if (req.body.doctorName) {
            andList.push({ doctorName: { doctorName: req.body.doctorName } });
        }
        if (req.body.specialization) {
            andList.push({ specialization: { specialization: req.body.specialization } });
        }
        if (req.body.language) {
            andList.push({ language: { language: req.body.language } });
        }
        if (req.body.state) {
            andList.push({ state: { state: req.body.state } });
        }
        if (req.body.city) {
            andList.push({ city: { city: req.body.city } });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const doctorList = await doctor_model_1.Doctor.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const doctorCount = await doctor_model_1.Doctor.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { doctorList, doctorCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredDoctor = getFilteredDoctor;
/**
 * @author Santhosh Khan K
 * @date   13-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all doctor count
 */
let getAllDoctorCount = async (req, res, next) => {
    try {
        const doctorCount = await doctor_model_1.Doctor.find({ $and: [{ isDeleted: false }, { doctor: req.body.loginId }] }).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-AllDoctorCount', true, 200, { doctorCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-AllDoctorCount', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllDoctorCount = getAllDoctorCount;
/**
 * @author Santhosh Khan K
 * @date   13-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create doctor appointment
 */
const createDoctorAppointment = async (req, res, next) => {
    try {
        const appointment = req.body;
        const isSlotAvailable = await doctor_model_1.Doctor.findOne({ _id: req.body._id, scheduleTime: req.body.scheduleTime, scheduleDays: req.body.scheduleDays, userId: req.body.userId });
        if (isSlotAvailable) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-DoctorAppointment', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Appointment slot is not available');
        }
        const newAppointment = new doctor_model_1.Doctor(appointment);
        await newAppointment.save();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-DoctorAppointment', true, 200, newAppointment, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-DoctorAppointment', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.createDoctorAppointment = createDoctorAppointment;
/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get All Doctor Profile
 */
let getAllDoctorProfile = async (req, res, next) => {
    try {
        const DoctorData = await doctor_model_1.Doctor.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(8);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Doctor', true, 200, DoctorData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Doctor', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllDoctorProfile = getAllDoctorProfile;
/**
 * @author Santhosh Khan K
 * @date   18-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get doctor review
 */
let doctorReview = async (req, res, next) => {
    try {
        const { _id, rating, comment } = req.body;
        const doctorData = await doctor_model_1.Doctor.findByIdAndUpdate(_id, { $push: { reviews: { rating, comment } } }, { new: true });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Doctor-Review', true, 200, doctorData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Doctor-Review', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.doctorReview = doctorReview;
/**
 * @author Santhosh Khan K
 * @date   18-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Doctor qualification
 */
let updateDoctorQualification = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const doctorDetails = req.body;
            const doctorConnect = await doctor_model_1.Doctor.findOne({ _id: req.body._id });
            if (doctorConnect) {
                const doctorData = await doctor_model_1.Doctor.findByIdAndUpdate({ _id: doctorDetails._id }, // find Doctor id
                {
                    $set: { 'education.$[education]': doctorDetails.qualification } //update inside array index value
                }, {
                    arrayFilters: [{ 'education._id': doctorDetails.qualification._id },], //find array index filter concept
                    new: true
                });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-DoctorEducation', true, 200, doctorData, 'Successfully Add Education');
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-DoctorEducation', true, 200, {}, 'Doctor NOt Found');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-DoctorEducation', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-DoctorEducation', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateDoctorQualification = updateDoctorQualification;
/**
 * @author Santhosh Khan K
 * @date   18-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Doctor education
 */
let updateDoctorExperience = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const doctorDetails = req.body;
            const doctorConnect = await doctor_model_1.Doctor.findOne({ _id: req.body._id });
            if (doctorConnect) {
                const doctorData = await doctor_model_1.Doctor.findByIdAndUpdate({ _id: doctorDetails._id }, // find Doctor id
                {
                    $set: { 'education.$[education]': doctorDetails.experience } //update inside array index value
                }, {
                    arrayFilters: [{ 'education._id': doctorDetails.experience._id },], //find array index filter concept
                    new: true
                });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-DoctorEducation', true, 200, doctorData, 'Successfully Add Education');
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-DoctorEducation', true, 200, {}, 'Doctor NOt Found');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-DoctorEducation', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-DoctorEducation', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateDoctorExperience = updateDoctorExperience;
/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete doctor experience.
 */
let deleteDoctorExperience = async (req, res, next) => {
    try {
        const doctorConnect = await doctor_model_1.Doctor.findOne({ _id: req.body._id });
        if (doctorConnect) {
            const doctorData = await doctor_model_1.Doctor.updateOne({ _id: req.body._id }, { $pull: { experience: { _id: req.body.experience._id } } });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-DoctorExperience', true, 200, doctorData, 'Successfully Remove Experience');
        }
        else {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-DoctorExperience', true, 200, {}, 'Doctor NOt Found');
        }
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-DoctorExperience', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteDoctorExperience = deleteDoctorExperience;
/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Doctor Qualification
 */
let deleteDoctorQualification = async (req, res, next) => {
    try {
        const doctorConnect = await doctor_model_1.Doctor.findOne({ _id: req.body._id });
        if (doctorConnect) {
            const doctorData = await doctor_model_1.Doctor.updateOne({ _id: req.body._id }, { $pull: { qualification: { _id: req.body.qualification._id } } });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'delete-DoctorQualification', true, 200, doctorData, 'Successfully Remove Qualification');
        }
        else {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'delete-DoctorQualification', true, 200, {}, 'Doctor NOt Found');
        }
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-DoctorQualification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteDoctorQualification = deleteDoctorQualification;
//# sourceMappingURL=doctor.controller.js.map
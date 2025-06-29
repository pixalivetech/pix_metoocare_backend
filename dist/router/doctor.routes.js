"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const doctor_controller_1 = require("../controller/doctor.controller");
const checkAuth_1 = require("../middleware/checkAuth");
const Validators_1 = require("../middleware/Validators");
const tokenManager_1 = require("../utils/tokenManager");
router.post('/', // create user
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('doctorName'), doctor_controller_1.saveDoctors);
router.get('/', // get all user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.getAllDoctor);
router.put('/', // update user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), doctor_controller_1.updateDoctor);
router.delete('/', // delete user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), doctor_controller_1.deleteDoctor);
router.get('/getSingleDoctor', // get single user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), doctor_controller_1.getSingleDoctor);
router.get('/getProfileDetails', // get Profile Details
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), doctor_controller_1.getProfileDetails);
router.put('/getFilteredDoctor', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.getFilteredDoctor);
router.get('/getFilteredDoctorCount', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.getFilteredDoctor);
router.post('/createDoctorAppointment', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.createDoctorAppointment);
router.get('/getAllDoctorProfile', // get filtered user  // without Checking Session
checkAuth_1.basicAuthUser, doctor_controller_1.getAllDoctorProfile);
router.put('/updateDoctorExperience', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.updateDoctorExperience);
router.put('/updateDoctorQualification', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.updateDoctorQualification);
router.delete('/deleteDoctorExperience', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.deleteDoctorExperience);
router.delete('/deleteDoctorQualification', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.deleteDoctorQualification);
router.post('/doctorReview', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctor_controller_1.doctorReview);
exports.default = router;
//# sourceMappingURL=doctor.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctorAppoiment_controller_1 = require("../controller/doctorAppoiment.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/bookAppointment', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorAppoiment_controller_1.bookAppointment);
router.get('/', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorAppoiment_controller_1.getAllAppointment);
router.get('/getSingleAppointment', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('id'), doctorAppoiment_controller_1.getSingleAppointment);
router.delete('/', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('id'), doctorAppoiment_controller_1.deleteAppointment);
router.put('/filterAppointment', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorAppoiment_controller_1.getFilterAppointment);
router.get('/getDoctorAppointments', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorAppoiment_controller_1.getDoctorAppointments);
router.get('/getUserAppointments', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorAppoiment_controller_1.getUserAppointments);
router.put('/updatedStatus', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('scheduleStatus'), doctorAppoiment_controller_1.updatedAppointmentStatus);
exports.default = router;
//# sourceMappingURL=doctorAppoiment.routes.js.map
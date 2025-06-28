"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const login_controller_1 = require("../controller/login.controller");
const router = (0, express_1.Router)();
router.post('/userLogin', //for user  //without checking session
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), login_controller_1.login);
router.post('/verifyGmailOtp', //without checking session
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), (0, Validators_1.checkRequestBodyParams)('otp'), login_controller_1.verifyGmailOtp);
router.post('/panelLogin', //for panel  //without checking session
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), login_controller_1.login);
router.post('/companyLogin', //for company  //without checking session
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), login_controller_1.login);
router.post('/doctorLogin', //for doctor   //without checking session
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), login_controller_1.login);
router.post('/verifyEmailOtp', //without checking session
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), (0, Validators_1.checkRequestBodyParams)('otp'), login_controller_1.verifyEmailOtp);
exports.default = router;
//# sourceMappingURL=login.routes.js.map
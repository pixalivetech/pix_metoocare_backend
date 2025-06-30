"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const doctorReview_controller_1 = require("../controller/doctorReview.controller");
const router = (0, express_1.Router)();
router.post('/', // create product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorReview_controller_1.saveDoctorReview);
router.get('/', // get all product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorReview_controller_1.getAllDoctorReview);
router.put('/', // update product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), doctorReview_controller_1.updateDoctorReview);
router.delete('/', // delete product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), doctorReview_controller_1.deleteDoctorReview);
router.get('/getSingleDoctorReview', // get single product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), doctorReview_controller_1.getSingleDoctorReview);
router.get('/getDoctorReview', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('doctorId'), doctorReview_controller_1.getDoctorReviews);
router.put('/getFilterDoctorReview', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, doctorReview_controller_1.getFilterDoctorReview);
exports.default = router;
//# sourceMappingURL=doctorReview.routes.js.map
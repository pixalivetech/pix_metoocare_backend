"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../controller/company.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', // create company
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), company_controller_1.saveCompany);
router.get('/', // get all company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, company_controller_1.getAllCompany);
router.put('/', // update company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), company_controller_1.updateCompany);
router.delete('/', // delete company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), company_controller_1.deleteCompany);
router.get('/getsingleCompany', // get single company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), company_controller_1.getSingleCompany);
router.get('/getProfileDetails', // get single company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, company_controller_1.getProfileDetails);
router.put('/getFilterCompany', // get filtered company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, company_controller_1.getFilteredCompany);
exports.default = router;
//# sourceMappingURL=company.routes.js.map
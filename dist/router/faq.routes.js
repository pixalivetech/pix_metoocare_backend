"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faq_controller_1 = require("../controller/faq.controller");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const Validators_1 = require("../middleware/Validators");
const router = (0, express_1.Router)();
router.post('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, faq_controller_1.saveFaq);
router.post('/replydoctor', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, faq_controller_1.replydoctor);
router.get('/getSingleUser', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), faq_controller_1.getSingleUser);
router.get('/getFilterDeveloper', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, faq_controller_1.getFilterFaq);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), faq_controller_1.deleteFaq);
router.get('/getAllQuestions', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, faq_controller_1.getAllFaq);
exports.default = router;
//# sourceMappingURL=faq.routes.js.map
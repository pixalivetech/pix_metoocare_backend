"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Validators_1 = require("../middleware/Validators");
const language_controller_1 = require("../controller/language.controller");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', // get all languages  //without checking session
(0, Validators_1.checkQuery)('code'), language_controller_1.getLanguages);
router.post('/', // change language\   //without checking session
(0, Validators_1.checkRequestBodyParams)('code'), language_controller_1.changeLanguage);
router.post('/changedLanguage', // change language\   //without checking session
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('newLanguage'), language_controller_1.changedLanguage);
exports.default = router;
//# sourceMappingURL=language.routes.js.map
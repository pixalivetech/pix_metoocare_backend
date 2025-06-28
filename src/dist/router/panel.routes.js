"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const panel_controller_1 = require("../controller/panel.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', // create company
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('mobileNumber'), panel_controller_1.savePanel);
router.get('/', // get all company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, panel_controller_1.getallPanel);
router.put('/', // update company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, panel_controller_1.updatePanel);
router.delete('/', // delete company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), panel_controller_1.deletePanel);
router.get('/getSinglePanel', // get single company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), panel_controller_1.getSinglePanel);
router.get('/getProfileDetails', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), panel_controller_1.getProfileDetails);
router.put('/getFilterPanel', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, panel_controller_1.getFilteredPanel);
router.get('/getallPanelProfile', checkAuth_1.basicAuthUser, panel_controller_1.getallPanelProfile);
exports.default = router;
//# sourceMappingURL=panel.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const panelReview_controller_1 = require("../controller/panelReview.controller");
const router = (0, express_1.Router)();
router.post('/', // create product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, panelReview_controller_1.savePanelReview);
router.get('/', // get all product
checkAuth_1.basicAuthUser, panelReview_controller_1.getAllPanelReview);
router.put('/', // update product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), panelReview_controller_1.updatePanelReview);
router.delete('/', // delete product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), panelReview_controller_1.deletePanelReview);
router.get('/getSinglePanelReview', // get single product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), panelReview_controller_1.getSinglePanelReview);
router.put('/getFilterPanelReview', // get single product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, panelReview_controller_1.getFilterPanelReview);
exports.default = router;
//# sourceMappingURL=panelReview.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const contact_controller_1 = require("../controller/contact.controller");
const checkAuth_1 = require("../middleware/checkAuth");
const Validators_1 = require("../middleware/Validators");
const tokenManager_1 = require("../utils/tokenManager");
router.post('/', //save contact  // without checking session
checkAuth_1.basicAuthUser, contact_controller_1.saveContact);
router.get('/', //get all contact   
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, contact_controller_1.getAllUser);
router.get('/getSingleUser', //get single user   
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), contact_controller_1.getSingleUsers);
router.delete('/', //delete users',
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), contact_controller_1.deletedUsers);
router.put('/getFilterContact', //get filter for users',
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), contact_controller_1.getFilterContact);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controller/users.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', // create user
checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), users_controller_1.saveUsers);
router.get('/', // get all user
checkAuth_1.basicAuthUser, 
// checkSession,
users_controller_1.getAllUser);
router.put('/', // update user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), users_controller_1.updateUser);
router.delete('/', // delete user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), users_controller_1.deleteUser);
router.get('/getSingleUser', // get single user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), users_controller_1.getSingleUser);
router.get('/getProfileDetails', // get Profile Details
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, users_controller_1.getProfileDetails);
router.put('/getFilteredUser', // get filtered user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, users_controller_1.getFilteredUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
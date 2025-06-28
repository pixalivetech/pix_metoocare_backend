"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controller/chat.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.get('/getUserChats', // get all product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('userId'), chat_controller_1.getUserSentChats);
router.get('/getDoctorChats', // get single userid all products view
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('doctorId'), chat_controller_1.getDoctorChats);
router.post('/doctorChat', // create chat message for user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('userId'), (0, Validators_1.checkRequestBodyParams)('doctorId'), (0, Validators_1.checkRequestBodyParams)('message'), chat_controller_1.doctorSendMessages);
router.post('/userChat', // create chat message for user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('userId'), (0, Validators_1.checkRequestBodyParams)('doctorId'), (0, Validators_1.checkRequestBodyParams)('message'), chat_controller_1.userSendMessages);
router.get('/', // get all product
checkAuth_1.basicAuthUser, 
// checkSession,
chat_controller_1.getAllChats);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map
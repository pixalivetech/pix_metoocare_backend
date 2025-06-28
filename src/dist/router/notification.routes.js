"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const notification_controller_1 = require("../controller/notification.controller");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, notification_controller_1.getAllNotification);
router.put('/getFilterNotification', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, notification_controller_1.getFilterNotification);
router.put('/updateNotificationView', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, notification_controller_1.updateNotificationView);
router.get('/getUnviewedNotification', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, notification_controller_1.getUnviewedNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map
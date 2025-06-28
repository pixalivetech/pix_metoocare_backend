"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../controller/coupon.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/createCoupon', // create chat message for user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('companyId'), coupon_controller_1.createCoupon);
router.post('/applyCoupon', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, coupon_controller_1.applyCoupon);
router.post('/useCoupon', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('code'), (0, Validators_1.checkRequestBodyParams)('userId'), coupon_controller_1.useCoupon);
exports.default = router;
//# sourceMappingURL=coupon.routes.js.map
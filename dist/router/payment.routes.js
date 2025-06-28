"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controller/payment.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.post('/payment', // initiate payment
checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), payment_controller_1.paymentOrder);
router.get('/verify', // handle payment response
checkAuth_1.basicAuthUser, 
//checkSession
(0, Validators_1.checkQuery)('orderId'), payment_controller_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map
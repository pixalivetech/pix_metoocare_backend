"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controller/order.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', // create order // without checking session
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('userId'), order_controller_1.saveOrder);
router.get('/', // get all orders
checkAuth_1.basicAuthUser, 
// checkSession,
order_controller_1.getAllOrder);
router.put('/', // update order
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), order_controller_1.updateOrder);
router.delete('/', // delete order
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), order_controller_1.deleteOrder);
router.get('/getSingleOrder', // get single order
checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), order_controller_1.getSingleOrder);
router.get('/trackOrderNumber', // track order
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('orderNumber'), order_controller_1.trackOrderNumber);
router.get('/trackTrakingNumber', // track order
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('trakingNumber'), order_controller_1.trackTrakingNumber);
router.put('/getFilteredOrder', // get filtered order
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, order_controller_1.getFilteredOrder);
router.put('/updateOrderStatus', // update order status
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, order_controller_1.updateOrderStatus);
router.put('/cancelOrReturnOrder', // cancel ordered
checkAuth_1.basicAuthUser, 
// checkSession,
order_controller_1.cancelOrReturnOrder);
router.post('/payment', // initiate payment
checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), order_controller_1.paymentOrder);
router.get('/verify', // handle payment response
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('orderId'), order_controller_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=order.routes.js.map
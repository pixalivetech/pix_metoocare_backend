"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addToCart_controller_1 = require("../controller/addToCart.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', //  products add to cart
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('userId'), addToCart_controller_1.savedAddToCart);
router.get('/', // get single userid all products view
checkAuth_1.basicAuthUser, 
// checkSession,
addToCart_controller_1.getAllCartDetails);
router.get('/getSingleAddToCart', // get single cart
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), addToCart_controller_1.getSingleAddToCart);
router.delete('/deletedAddToCart', // delete cart
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), addToCart_controller_1.deleteAddToCart);
router.delete('/productdelete', // single product delete
checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), (0, Validators_1.checkRequestBodyParams)('productId'), addToCart_controller_1.deleteProductFromCart);
router.post('/orderplace', // order place
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('userId'), addToCart_controller_1.updateAddToCart);
exports.default = router;
//# sourceMappingURL=addToCart.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const productRating_controller_1 = require("../controller/productRating.controller");
const router = (0, express_1.Router)();
router.post('/', // create product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, productRating_controller_1.saveProductRating);
router.get('/', // get all product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, productRating_controller_1.getAllProductRating);
router.put('/', // update product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), productRating_controller_1.updateProductRating);
router.delete('/', // delete product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), productRating_controller_1.deleteProductRating);
router.get('/getSingleProductRating', // get single product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), productRating_controller_1.getSingleProductRating);
router.put('/getFilterProductRating', // get single product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, productRating_controller_1.getFilterProductRating);
router.get('/getPanelRatings', // get single product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('panelId'), productRating_controller_1.getPanelRatings);
exports.default = router;
//# sourceMappingURL=productRating.routes.js.map
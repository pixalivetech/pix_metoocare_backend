"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', // create product
checkAuth_1.basicAuthUser, 
// checkSession,
product_controller_1.saveProduct);
router.get('/', // get all product
checkAuth_1.basicAuthUser, 
// checkSession,
product_controller_1.getAllProduct);
router.put('/', // update product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), product_controller_1.updateProduct);
router.delete('/', // delete product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, product_controller_1.deleteProduct);
router.put('/getFilterProduct', // get filtered product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, product_controller_1.getFilteredProduct);
router.get('/hotSellingForWeb', // get filtered product
checkAuth_1.basicAuthUser, product_controller_1.hotSellingForWeb);
router.get('/hotSelling', // get filtered product
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, product_controller_1.hotSelling);
router.get('/getSingleProduct', // get single product
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), product_controller_1.getSingleProduct);
router.post('/productForWeb', // save product for web
checkAuth_1.basicAuthUser, product_controller_1.saveProductForWeb);
router.get('/singleProduct', // get single product
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), product_controller_1.getSingleProductFoeWeb);
router.get('/getAllProductForWeb', // get all product for web //without checking session
checkAuth_1.basicAuthUser, product_controller_1.getAllProductForWeb);
router.put('/getFilterProductForWeb', // get filtered product for web //without checking session
checkAuth_1.basicAuthUser, product_controller_1.getFilteredProductForWeb);
router.post('/productForCompany', // save product for company
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, product_controller_1.saveProductForCompany);
router.post('/decreaseProductQuantity', // decrease product quantity
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, product_controller_1.decreaseProductQuantity);
router.post('/productRating', // product rating
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, product_controller_1.productRating);
router.put('/updateSpecifications', // update specifications
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, product_controller_1.updateSpecifications);
exports.default = router;
//# sourceMappingURL=product.routes.js.map
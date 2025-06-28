"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controller/category.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, category_controller_1.addCategory);
router.get('/', //getall
checkAuth_1.basicAuthUser, category_controller_1.getCategories);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('name'), category_controller_1.updateCategory);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), category_controller_1.deleteCategory);
router.get('/getSingleCategory', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), category_controller_1.getCategoryById);
router.put('/getFilterCategory', checkAuth_1.basicAuthUser, category_controller_1.getFilteredCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carouselItem_controller_1 = require("../controller/carouselItem.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('companyId'), (0, Validators_1.checkRequestBodyParams)('title'), (0, Validators_1.checkRequestBodyParams)('content'), (0, Validators_1.checkRequestBodyParams)('image'), carouselItem_controller_1.addCarouselItem);
router.get('/', checkAuth_1.basicAuthUser, carouselItem_controller_1.getCarouselItems);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), carouselItem_controller_1.updateCarousel);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), carouselItem_controller_1.deleteCarousel);
router.put('/getFilterCarousel', checkAuth_1.basicAuthUser, carouselItem_controller_1.getFilteredCarousel);
router.get('/getSingleCarousel', checkAuth_1.basicAuthUser, carouselItem_controller_1.getSingleCarousel, (0, Validators_1.checkQuery)('_id'), carouselItem_controller_1.getSingleCarousel);
exports.default = router;
//# sourceMappingURL=carouselItem.routes.js.map
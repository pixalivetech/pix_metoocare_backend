"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const invoice_controller_1 = require("../controller/invoice.controller");
router.get('/getInvoiceNumber', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, invoice_controller_1.getInvoiceNumber);
router.get("/", checkAuth_1.basicAuthUser, tokenManager_1.checkSession, invoice_controller_1.getAllInvoice);
router.put('/generateInvoiceCopy', // generate invoice copy
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, invoice_controller_1.generateInvoiceCopy);
router.delete("/", checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), invoice_controller_1.deleteInvoice);
router.put("/getFilterInvoice", checkAuth_1.basicAuthUser, tokenManager_1.checkSession, invoice_controller_1.getFilterInvoice);
exports.default = router;
//# sourceMappingURL=invoice.routes.js.map
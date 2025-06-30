"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentOrder = void 0;
const mongoose_1 = require("mongoose");
const paymentOrderSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    orderId: { type: String, required: true },
    orderAmount: { type: Number, required: true },
    orderCurrency: { type: String, required: true },
    customerId: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    returnUrl: { type: String, required: true },
    orderNote: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
});
exports.PaymentOrder = mongoose_1.default.model('PaymentOrder', paymentOrderSchema);
//# sourceMappingURL=payment.model.js.map
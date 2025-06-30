"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = exports.couponSchema = void 0;
const mongoose_1 = require("mongoose");
exports.couponSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true },
    companyId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Company' },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    productId: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' }],
    discountedPrice: { type: Number },
    code: { type: String },
    // usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    validFrom: { type: Date },
    validTill: { type: Date },
    usedBy: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: 'User' },
    isUsed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
});
exports.Coupon = mongoose_1.default.model('Coupon', exports.couponSchema);
//# sourceMappingURL=coupon.model.js.map
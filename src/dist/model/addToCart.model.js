"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCart = void 0;
const mongoose_1 = require("mongoose");
const addToCartSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    userId: { type: String, required: true, ref: 'User' },
    items: [{
            productId: { type: mongoose_1.default.Types.ObjectId, ref: "Product" },
            companyId: { type: mongoose_1.default.Types.ObjectId, ref: "Company" },
            panelId: { type: mongoose_1.default.Types.ObjectId, ref: "Panel" },
            productName: { type: String },
            productImage: { type: String },
            quantity: { type: Number },
            productPrice: { type: Number },
            selling: { type: String, default: "normal" },
            originalPrice: { type: Number },
            discountPercentage: { type: Number },
            discountedPrice: { type: Number, default: 0 },
            gstRate: { type: Number },
            gstAmount: { type: Number },
            finalPrice: { type: Number },
        }],
    operation: { type: String, default: "increase" || "decrease" || "clearCart" || "placeOrder" },
    totalAmount: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
    isPurchased: { type: Boolean, default: false },
    purchaseDate: { type: Date },
});
exports.AddToCart = mongoose_1.default.model("AddToCart", addToCartSchema);
//# sourceMappingURL=addToCart.model.js.map
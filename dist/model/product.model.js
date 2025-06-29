"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    panelId: { type: mongoose_1.default.Types.ObjectId, ref: "Panel" },
    companyId: { type: mongoose_1.default.Types.ObjectId, ref: "Company" },
    categoryName: { type: String },
    categoryImage: { type: String },
    productName: { type: String },
    productDescription: { type: String },
    topImage: { type: String },
    sideImage: { type: String },
    frontImage: { type: String },
    backImage: { type: String },
    productGif: { type: String },
    specifications: [{
            heading: { type: String },
            points: [{ type: String }]
        }],
    selling: { type: String, default: "normal" },
    originalPrice: { type: Number },
    discountPercentage: { type: Number },
    discountedPrice: { type: Number, default: 0 },
    productImage: { type: String },
    quantity: { type: Number },
    gstRate: { type: Number },
    gstAmount: { type: Number },
    benefits: [{ type: String }],
    finalPrice: { type: Number },
    rating: { type: Number },
    comment: { type: String },
    title: { type: String },
    images: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
});
exports.Product = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=product.model.js.map
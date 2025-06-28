"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRating = void 0;
const mongoose_1 = require("mongoose");
const productRatingSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    productId: { type: mongoose_1.default.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    panelId: { type: mongoose_1.default.Types.ObjectId, ref: "Panel" },
    title: { type: String },
    images: [{ type: String }],
    comment: { type: String },
    rating: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.ProductRating = mongoose_1.default.model("ProductRating", productRatingSchema);
//# sourceMappingURL=productRating.model.js.map
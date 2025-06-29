"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorReview = void 0;
const mongoose_1 = require("mongoose");
const doctorReviewSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    doctorId: { type: mongoose_1.default.Types.ObjectId, ref: "Doctor" },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    fullName: { type: String },
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
exports.DoctorReview = mongoose_1.default.model("DoctorReview", doctorReviewSchema);
//# sourceMappingURL=doctorReview.model.js.map
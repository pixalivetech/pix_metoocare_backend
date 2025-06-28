"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    email: { type: String },
    otp: { type: Number },
    name: { type: String },
    mobileNumber: { type: Number },
    profileImage: { type: String },
    companyName: { type: String },
    companyAddress: { type: String },
    typesOfBusiness: { type: String },
    city: { type: String },
    state: { type: String },
    fcm_Token: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
});
exports.Company = mongoose_1.default.model("Company", companySchema);
//# sourceMappingURL=company.model.js.map
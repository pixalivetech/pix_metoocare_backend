"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panel = void 0;
const mongoose_1 = require("mongoose");
const panelSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    email: { type: String, unique: true, required: true },
    otp: { type: Number, default: 0 },
    name: { type: String },
    mobileNumber: { type: Number, required: true },
    profileImage: { type: String },
    companyName: { type: String },
    companyAddress: { type: String },
    typesOfBusiness: { type: String },
    city: { type: String },
    state: { type: String },
    fcm_Token: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Panel = mongoose_1.default.model("Panel", panelSchema);
//# sourceMappingURL=panel.model.js.map
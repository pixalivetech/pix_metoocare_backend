"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
;
const usersSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, auto: true },
    email: { type: String, unique: true, required: true },
    doctorId: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Doctor' }],
    name: { type: String },
    fullName: { type: String },
    otp: { type: Number },
    questionCount: { type: Number, default: 0 },
    fcm_Token: { type: String },
    profileImage: { type: String },
    gender: { type: String },
    mobileNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: Number },
    landmark: { type: String },
    canceledOrders: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Order' }],
    alternativeMobileNumber: { type: String },
    locality: { type: String },
    useMyCurretAddress: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.Users = mongoose_1.default.model('User', usersSchema);
//# sourceMappingURL=users.model.js.map
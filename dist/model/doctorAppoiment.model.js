"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorAppointment = void 0;
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    doctorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Doctor' },
    name: { type: String },
    mobileNumber: { type: Number },
    scheduleTime: { type: String },
    scheduleDate: [{ type: String }],
    scheduleStatus: { type: String },
    ticketNumber: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.DoctorAppointment = mongoose_1.default.model('DoctorAppoiment', doctorSchema);
//# sourceMappingURL=doctorAppoiment.model.js.map
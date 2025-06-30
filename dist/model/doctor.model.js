"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true },
    doctorName: { type: String },
    userId: { type: String, ref: 'User' },
    email: { type: String },
    otp: { type: Number },
    phone: { type: Number },
    specialization: [{ type: String }],
    profileImage: { type: String },
    language: { type: String },
    gender: { type: String },
    doctorBio: { type: String },
    qualification: [{
            college: { type: String },
            degree: { type: String },
            specialization: { type: String },
            from: { type: String },
            to: { type: String },
            yearOfPassing: { type: String },
            percentage: { type: String },
            currentlyStudying: { type: Boolean },
            grade: { type: String }
        }],
    experience: [{
            role: { type: String },
            organization: { type: String },
            from: { type: String },
            to: { type: String },
            currentlyWorking: { type: Boolean },
            location: { type: String }
        }],
    address: { type: String },
    scheduleTime: { type: String },
    scheduleDays: { type: String },
    overAllQualification: { type: String },
    overAllExperience: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: Number },
    landLineNumber: { type: Number },
    fcmToken: { type: String },
    reviews: [
        { userId: { type: String, ref: 'User' },
            rating: { type: Number },
            comment: { type: String } }
    ],
    averageRating: { type: Number, default: 0 },
    services: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
});
exports.Doctor = mongoose_1.default.model("Doctor", doctorSchema);
//# sourceMappingURL=doctor.model.js.map
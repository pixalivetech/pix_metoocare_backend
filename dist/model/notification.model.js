"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    description: { type: String },
    date: { type: Date },
    title: { type: String },
    from: {
        user: { type: mongoose_1.default.Types.ObjectId, refPath: "from.modelType" },
        modelType: { type: String, enum: ['Company', 'User', 'Doctor'], required: true }
    },
    to: {
        user: { type: mongoose_1.default.Types.ObjectId, refPath: "to.modelType" },
        modelType: { type: String, enum: ['Doctor', 'User', 'Company'], required: true }
    },
    isViewed: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Notification = mongoose_1.default.model('Notification', notificationSchema);
//# sourceMappingURL=notification.model.js.map
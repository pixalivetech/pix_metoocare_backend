"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const mongoose_1 = require("mongoose");
const luxon_1 = require("luxon");
const chatMessageSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose_1.Types.ObjectId, required: true, ref: 'User' },
    doctorId: { type: mongoose_1.Types.ObjectId, required: true, ref: 'Doctor' },
    message: { type: String, required: true },
    sentOn: { type: String, default: luxon_1.DateTime.utc().setZone('Asia/Kolkata').toFormat('HH:mm') },
    senderType: { type: String },
    isSeen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.ChatMessage = mongoose_1.default.model('chat', chatMessageSchema);
//# sourceMappingURL=chat.models.js.map
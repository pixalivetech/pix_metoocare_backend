"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.Types.ObjectId, required: true, ref: 'User' },
    doctorId: { type: mongoose_1.Types.ObjectId, required: true, ref: 'Doctor' },
    messages: [{ type: mongoose_1.Types.ObjectId, ref: 'chat' }],
});
exports.Conversation = mongoose_1.default.model('conversation', conversationSchema);
//# sourceMappingURL=conversation.model.js.map
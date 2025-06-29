"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    doctorId: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor' }],
    question: { type: String },
    answer: { type: String },
    hisPaid: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Faq = mongoose_2.default.model('Faq', faqSchema);
//# sourceMappingURL=faq.models.js.map
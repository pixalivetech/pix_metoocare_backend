"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelReview = exports.panelReviewSchema = void 0;
const mongoose_1 = require("mongoose");
exports.panelReviewSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, auto: true },
    panelId: { type: mongoose_1.default.Types.ObjectId, ref: "Panel" },
    name: { type: String },
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
exports.PanelReview = mongoose_1.default.model("PanelReview", exports.panelReviewSchema);
//# sourceMappingURL=panelReview.model.js.map
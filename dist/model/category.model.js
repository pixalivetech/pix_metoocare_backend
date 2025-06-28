"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    companyId: { type: mongoose_1.default.Types.ObjectId, ref: "Company" },
    categoryName: { type: String },
    categoryImage: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
});
exports.Category = mongoose_1.default.model("Category", categorySchema);
//# sourceMappingURL=category.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose = require("mongoose");
;
const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userName: { type: String },
    mobile: { type: Number },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Admin = mongoose.model("Admin", userSchema);
//# sourceMappingURL=admin.model.js.map
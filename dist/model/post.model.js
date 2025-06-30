"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
;
const postSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    doctorId: { type: mongoose_1.default.Types.ObjectId, ref: 'Doctor' },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
    video: { type: String },
    name: { type: String },
    content: { type: String },
    title: { type: String },
    likeCount: { type: Number, default: 0 },
    likes: [{
            user: { type: mongoose_1.default.Types.ObjectId, refPath: 'likes.modleType' },
            modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
        }],
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    comment: [
        {
            user: { type: mongoose_1.default.Types.ObjectId, refPath: 'comment.modelType' },
            modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
            comments: { type: String, default: "" },
            createdOn: { type: Date },
        }
    ],
    block: [{
            user: { type: mongoose_1.default.Types.ObjectId, refPath: 'block.modelType' },
            modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
        }],
    report: [{
            type: { type: String },
            user: { type: mongoose_1.default.Types.ObjectId, ref: 'report.modelType' },
            modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
            description: { type: String },
            createdOn: { type: Date }
        }],
    hashtag: { type: String },
    mention: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User' }],
    type: { type: String },
    date: { type: Number },
    month: { type: Number },
    year: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
});
exports.Post = mongoose_1.default.model("Post", postSchema);
//# sourceMappingURL=post.model.js.map
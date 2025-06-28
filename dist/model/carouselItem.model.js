"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselItem = void 0;
const mongoose_1 = require("mongoose");
const CarouselItemSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    companyId: { type: String, required: true, ref: 'Company' },
    title: { type: String },
    content: { type: String },
    image: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.CarouselItem = mongoose_1.default.model("Carousel", CarouselItemSchema);
//# sourceMappingURL=carouselItem.model.js.map
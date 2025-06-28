"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const mongoose_1 = require("mongoose");
const languageShema = new mongoose_1.default.Schema({
    id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
});
exports.Language = mongoose_1.default.model("Language", languageShema);
//# sourceMappingURL=language.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changedLanguage = exports.changeLanguage = exports.getLanguages = void 0;
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const language_model_1 = require("../model/language.model");
var activity = "Language";
const languages = [
    { id: 1, code: 'en', name: 'English' },
    { id: 2, code: 'es', name: 'Spanish' },
    { id: 3, code: 'fr', name: 'French' },
    { id: 4, code: 'hi', name: 'Hindi' },
    { id: 5, code: 'ar', name: 'Arabic' },
    { id: 6, code: 'de', name: 'German' },
    { id: 7, code: 'it', name: 'Italian' },
    { id: 8, code: 'ru', name: 'Russian' },
    { id: 9, code: 'ja', name: 'Japanese' },
    { id: 10, code: 'zh', name: 'Chinese' },
    { id: 11, code: 'ko', name: 'Korean' },
    { id: 12, code: 'pt', name: 'Portuguese' },
    { id: 13, code: 'ta', name: 'Tamil' },
];
let getLanguages = async (req, res, next) => {
    res.json(languages);
};
exports.getLanguages = getLanguages;
let changeLanguage = async (req, res, next) => {
    const { code, name } = req.body;
    const userId = req.params.userId;
    const newLanguageCode = req.body.languageCode;
    const newLanguageName = req.body.languageName;
    const language = languages.find((language) => language.code === code);
    if (language) {
        const languageModel = new language_model_1.Language();
        languageModel.id = language.id;
        languageModel.code = newLanguageCode;
        languageModel.name = newLanguageName;
        const result = await language_model_1.Language.updateOne({ _id: userId }, languageModel);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Change-Language', true, 200, result, ErrorMessage_1.clientError.success.registerSuccessfully);
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Change-Language', false, 500, {}, ErrorMessage_1.clientError.success.registerSuccessfully);
    }
};
exports.changeLanguage = changeLanguage;
const axios_1 = require("axios");
const changedLanguage = async (req, res, next) => {
    try {
        const { newLanguage } = req.body;
        const responsed = await axios_1.default.post('https://your-api-endpoint.com/change-language', { language: newLanguage, });
        if (responsed) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Change-Language', true, 200, responsed.data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
        }
        else {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Change-Language', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, 'Failed to change language');
        }
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Change-Language', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.changedLanguage = changedLanguage;
//# sourceMappingURL=language.controller.js.map
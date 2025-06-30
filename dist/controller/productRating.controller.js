"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPanelRatings = exports.getFilterProductRating = exports.updateProductRating = exports.deleteProductRating = exports.getSingleProductRating = exports.getAllProductRating = exports.saveProductRating = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const productRating_model_1 = require("../model/productRating.model");
var activity = "ProductRating";
let saveProductRating = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const productRatingDetails = req.body;
            const createData = new productRating_model_1.ProductRating(productRatingDetails);
            const insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-ProductRating', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-ProductRating', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-ProductRating', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveProductRating = saveProductRating;
let getAllProductRating = async (req, res, next) => {
    try {
        const productRatingDetails = await productRating_model_1.ProductRating.find({ isDeleted: false }).sort({ createdAt: -1 }).populate('userId', { name: 1, profileImage: 1 }).populate('productId', { productName: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-ProductRating', true, 200, productRatingDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-ProductRating', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllProductRating = getAllProductRating;
let getSingleProductRating = async (req, res, next) => {
    try {
        const productRatingDetails = await productRating_model_1.ProductRating.findOne({ _id: req.query._id }).populate('userId', { name: 1, profileImage: 1 }).populate('productId', { productName: 1 }).populate('panelId', { companyName: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-ProductRating', true, 200, productRatingDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-ProductRating', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleProductRating = getSingleProductRating;
let deleteProductRating = async (req, res, next) => {
    try {
        const { modifiedBy } = req.body;
        const productRatingDetails = await productRating_model_1.ProductRating.findOneAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: Date.now(),
                modifiedBy: modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-ProductRating', true, 200, productRatingDetails, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-ProductRating', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteProductRating = deleteProductRating;
let updateProductRating = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const productRatingDetails = req.body;
            const updateData = await productRating_model_1.ProductRating.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    title: productRatingDetails.title,
                    comment: productRatingDetails.comment,
                    rating: productRatingDetails.rating,
                    modifiedOn: Date.now(),
                    modifiedBy: req.user._id
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-ProductRating', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-ProductRating', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-ProductRating', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateProductRating = updateProductRating;
let getFilterProductRating = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.userId) {
            andList.push({ userId: req.body.userId });
        }
        if (req.body.productId) {
            andList.push({ productId: req.body.productId });
        }
        if (req.body.panelId) {
            andList.push({ panelId: req.body.panelId });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const productRatingList = await productRating_model_1.ProductRating.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('userId', { name: 1, profileImage: 1 }).populate('productId', { productName: 1 }).populate('panelId', { companyName: 1 });
        const productRatingCount = await productRating_model_1.ProductRating.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterAppointment', true, 200, { productRatingList, productRatingCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterAppointment', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterProductRating = getFilterProductRating;
const getPanelRatings = async (req, res, next) => {
    try {
        const panelRating = await productRating_model_1.ProductRating.find({ panelId: req.query.panelId, isDeleted: false }).populate('userId', { name: 1, profileImage: 1 }).populate('productId', { productName: 1 }).limit(10).sort({ createdAt: -1 }).skip(0);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-PanelRatings', true, 200, panelRating, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-PanelRatings', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getPanelRatings = getPanelRatings;
//# sourceMappingURL=productRating.controller.js.map
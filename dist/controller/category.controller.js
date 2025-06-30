"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCategory = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.addCategory = void 0;
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const category_model_1 = require("../model/category.model");
var activity = "Category";
/**
 * @author BalajiMurahari
 * @date 29-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is use to Create Category
 */
const addCategory = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const createCategory = req.body;
            const createdCategory = new category_model_1.Category(createCategory);
            const insertData = await createdCategory.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Add-Category', true, 200, insertData, ErrorMessage_1.clientError.success.fetchedSuccessfully, 'Category added successfully');
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-Category', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-Category', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Invalid data in the request');
    }
};
exports.addCategory = addCategory;
/**
* @author BalajiMurahari
* @date  29-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get the category
* */
const getCategories = async (req, res, next) => {
    try {
        const categories = await category_model_1.Category.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Categories', true, 200, categories, ErrorMessage_1.clientError.success.fetchedSuccessfully, 'Categories fetched successfully');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Categories', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getCategories = getCategories;
/**
* @author BalajiMurahari
* @date 29-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get a single Category by ID
*/
let getCategoryById = async (req, res, next) => {
    try {
        const data = await category_model_1.Category.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Category', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully, 'Category fetched successfully');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Category', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getCategoryById = getCategoryById;
/**
* @author BalajiMurahari
* @date 29-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to update Category
*/
const updateCategory = async (req, res, next) => {
    try {
        const categoryData = req.body;
        const updateData = await category_model_1.Category.findByIdAndUpdate({ _id: req.body._id }, {
            $set: {
                categoryName: categoryData.categoryName,
                categoryImage: categoryData.categoryImage,
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Category', true, 200, updateData, ErrorMessage_1.clientError.success.fetchedSuccessfully, 'Category updated successfully');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Category', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateCategory = updateCategory;
/**
* @author BalajiMurahari
* @date 29-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to delete Category
*/
let deleteCategory = async (req, res, next) => {
    try {
        let id = req.query._id;
        let { modifiedBy, modifiedOn } = req.body;
        const data = await category_model_1.Category.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true,
                modifiedBy: modifiedBy,
                modifiedOn: modifiedOn
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Category', true, 200, data, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Category', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCategory = deleteCategory;
/**
 * @author BalajiMurahari
 * @date   01-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered Category
 */
let getFilteredCategory = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.categoryName) {
            andList.push({ categoryName: req.body.categoryName });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const CategoryList = await category_model_1.Category.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const CategoryCount = await category_model_1.Category.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterCategory', true, 200, { CategoryList, CategoryCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterCategory', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCategory = getFilteredCategory;
//# sourceMappingURL=category.controller.js.map
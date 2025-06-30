"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleCarousel = exports.getFilteredCarousel = exports.deleteCarousel = exports.updateCarousel = exports.getCarouselItems = exports.addCarouselItem = void 0;
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const carouselItem_model_1 = require("../model/carouselItem.model");
var activity = "Carousel";
/**
 * @author BalajiMurahari
 * @date  28-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to manage the carousel items
 * */
const addCarouselItem = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const createCarouselItem = req.body;
            const createdata = new carouselItem_model_1.CarouselItem(createCarouselItem);
            const insertData = await createdata.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Add-Carousel-Item', true, 200, insertData, ErrorMessage_1.clientError.success.fetchedSuccessfully, 'Carousel item added successfully');
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-Carousel-Item', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-Carousel-Item', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Invalid data in the request');
    }
};
exports.addCarouselItem = addCarouselItem;
/**
* @author BalajiMurahari
* @date  28-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get the carousel items
* */
const getCarouselItems = async (req, res, next) => {
    try {
        const carouselItems = await carouselItem_model_1.CarouselItem.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Carousel-Items', true, 200, carouselItems, ErrorMessage_1.clientError.success.fetchedSuccessfully, 'Carousel items fetched successfully');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Carousel-Items', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getCarouselItems = getCarouselItems;
/**
* @author BalajiMurahari
* @date 28-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to update Carousel
*/
let updateCarousel = async (req, res, next) => {
    try {
        const carouselData = req.body;
        const updateData = await carouselItem_model_1.CarouselItem.findByIdAndUpdate({ _id: req.body._id }, {
            $set: {
                title: carouselData.title,
                content: carouselData.content,
                image: carouselData.image,
                modifiedBy: carouselData.modifiedBy,
                modifiedOn: carouselData.modifiedOn
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Carousel', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Carousel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateCarousel = updateCarousel;
/**
* @author BalajiMurahari
* @date 28-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to delete Carousel
*/
let deleteCarousel = async (req, res, next) => {
    try {
        let { modifiedBy, modifiedOn } = req.body;
        const data = await carouselItem_model_1.CarouselItem.findByIdAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedBy: modifiedBy,
                modifiedOn: modifiedOn
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Carousel', true, 200, data, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Carousel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCarousel = deleteCarousel;
/**
* @author Santhosh Khan K
* @date 29-12-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get filtered Carousel
*/
let getFilteredCarousel = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.title) {
            andList.push({ title: req.body.title });
        }
        if (req.body.content) {
            andList.push({ content: req.body.content });
        }
        if (req.body.image) {
            andList.push({ image: req.body.image });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        var carouselList = await carouselItem_model_1.CarouselItem.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page);
        var carouselCount = await carouselItem_model_1.CarouselItem.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilteredCarousel', true, 200, { carouselList, carouselCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilteredCarousel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCarousel = getFilteredCarousel;
/**
* @author Santhosh Khan K
* @date 29-12-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get single Carousel
*/
let getSingleCarousel = async (req, res, next) => {
    try {
        const carouselData = await carouselItem_model_1.CarouselItem.findById({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Single-Carousel', true, 200, carouselData, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Carousel', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCarousel = getSingleCarousel;
//# sourceMappingURL=carouselItem.controller.js.map
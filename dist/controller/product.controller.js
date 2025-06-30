"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProductFoeWeb = exports.updateSpecifications = exports.productRating = exports.saveProductForCompany = exports.getFilteredProductForWeb = exports.hotSellingForWeb = exports.getAllProductForWeb = exports.saveProductForWeb = exports.getSingleProduct = exports.hotSelling = exports.getFilteredProduct = exports.deleteProduct = exports.updateProduct = exports.getAllProduct = exports.decreaseProductQuantity = exports.saveProduct = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const product_model_1 = require("../model/product.model");
var activity = "Product";
/**
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to calculate the discounted price
 */
let saveProduct = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const productDetails = req.body;
            const { originalPrice, discountPercentage, gstRate, specifications: rawSpecifications } = productDetails;
            const finalPrice = Number(originalPrice) + Number((Number(originalPrice) * Number(gstRate)) / 100); // gst will be added
            productDetails.finalPrice = Math.round(Number(finalPrice));
            const discountedPrice = Number(finalPrice) - Number(Number(finalPrice) * Number(discountPercentage) / 100); // discount will be added
            productDetails.discountedPrice = Math.round(Number(discountedPrice));
            let specifications = [];
            if (Array.isArray(rawSpecifications)) {
                specifications = rawSpecifications.map((spec) => ({
                    heading: spec.heading,
                    points: spec.points,
                }));
            }
            const createData = new product_model_1.Product(productDetails);
            const insertData = await createData.save();
            // if (insertData && insertData._id) {
            //     const purchasedProduct = await Product.findById(insertData._id);
            //     if (purchasedProduct) {
            //         purchasedProduct.quantity -= 1;
            //         await purchasedProduct.save();
            //     }
            // }
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Product', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Product', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveProduct = saveProduct;
/**
 * @author Santhosh Khan K
 * @date   26-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to decrease the quantity
 */
const decreaseProductQuantity = async (req, res, next) => {
    const productId = req.body._id;
    const quantityToPurchase = req.body.quantityToPurchase;
    try {
        const product = await product_model_1.Product.findById(productId);
        if (!product) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Decrease-Quantity', false, 404, {}, ErrorMessage_1.errorMessage.notFound, 'Product not found');
        }
        const startingQuantity = 1;
        if (product.quantity < quantityToPurchase) {
        }
        const remainingQuantity = product.quantity - quantityToPurchase;
        product.quantity = remainingQuantity >= startingQuantity ? remainingQuantity : startingQuantity;
        await product.save();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Decrease-Quantity', true, 200, {}, remainingQuantity, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Decrease-Quantity', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.decreaseProductQuantity = decreaseProductQuantity;
/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all products
 */
let getAllProduct = async (req, res, next) => {
    try {
        const productDetails = await product_model_1.Product.find({ isDeleted: false }).sort({ createdAt: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Product', true, 200, productDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllProduct = getAllProduct;
/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update product.
 */
let updateProduct = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const productDetails = req.body;
            const { specifications: rawSpecifications, benefits: rawBenefits } = productDetails;
            const { originalPrice, discountPercentage, gstRate } = productDetails;
            const finalPrice = Number(originalPrice) + Number((Number(originalPrice) * Number(gstRate)) / 100);
            productDetails.finalPrice = Math.round(Number(finalPrice));
            const discountedPrice = Number(finalPrice) - Number(Number(finalPrice) * Number(discountPercentage) / 100);
            productDetails.discountedPrice = Math.round(Number(discountedPrice));
            let specifications = [];
            if (Array.isArray(rawSpecifications)) {
                specifications = rawSpecifications.map(spec => ({
                    heading: spec.heading,
                    points: spec.points
                }));
            }
            let benefits = [];
            if (Array.isArray(rawBenefits)) {
                benefits = rawBenefits.map(benefit => String(benefit));
            }
            const updateData = await product_model_1.Product.findOneAndUpdate({
                _id: req.body._id
            }, {
                $set: {
                    productName: productDetails.productName,
                    productDescription: productDetails.productDescription,
                    productGif: productDetails.productGif,
                    quantity: productDetails.quantity,
                    originalPrice: productDetails.originalPrice,
                    categoryName: productDetails.categoryName,
                    gstRate: productDetails.gstRate,
                    finalPrice: productDetails.finalPrice,
                    discountPercentage: productDetails.discountPercentage,
                    discountedPrice: productDetails.discountedPrice,
                    selling: productDetails.selling,
                    topImage: productDetails.topImage,
                    sideImage: productDetails.sideImage,
                    backImage: productDetails.backImage,
                    frontImage: productDetails.frontImage,
                    productImage: productDetails.productImage,
                    modifiedOn: productDetails.modifiedOn,
                    modifiedBy: productDetails.modifiedBy,
                    specifications: specifications,
                    benefits: benefits
                }
            }, {
                new: true // Return the updated document
            });
            // Uncomment this block if you want to increment the quantity
            // if (updateData && updateData._id) {
            //     const purchasedProduct = await Product.findById(updateData._id);
            //     if (purchasedProduct) {
            //         purchasedProduct.quantity += 1;
            //         await purchasedProduct.save();
            //     }
            // }
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Product', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Product', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateProduct = updateProduct;
/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete product
 */
let deleteProduct = async (req, res, next) => {
    try {
        const productDetails = await product_model_1.Product.findOneAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Product', true, 200, productDetails, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteProduct = deleteProduct;
/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered product
 */
let getFilteredProduct = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.panelId) {
            andList.push({ panelId: req.body.panelId });
        }
        if (req.body.productName) {
            andList.push({ productName: { productName: req.body.productName } });
        }
        if (req.body.productPrice) {
            andList.push({ productPrice: req.body.productPrice });
        }
        if (req.body.productDiscount) {
            andList.push({ productDiscount: req.body.productDiscount });
        }
        if (req.body.selling) {
            andList.push({ selling: req.body.selling });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const productList = await product_model_1.Product.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('panelId', { companyName: 1 }).populate('companyId', { companyName: 1 });
        const productCount = await product_model_1.Product.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList, productCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredProduct = getFilteredProduct;
/**
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Hot Selling product
 */
let hotSelling = async (req, res, next) => {
    try {
        const productList = await product_model_1.Product.find({ $and: [{ selling: "hot" }, { isDeleted: false }] }).sort({ createdOn: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.hotSelling = hotSelling;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Product
 */
let getSingleProduct = async (req, res, next) => {
    try {
        const productDetails = await product_model_1.Product.findById({ _id: req.query._id, quantity: req.query.quantity }).sort({ createdOn: -1 }).populate('panelId', { companyName: 1 }).populate('companyId', { companyName: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Product', true, 200, productDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleProduct = getSingleProduct;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Product For Web
 */
let saveProductForWeb = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const productDetails = req.body;
            const createData = new product_model_1.Product(productDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Product', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Product ', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveProductForWeb = saveProductForWeb;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get All Product For Web
 */
let getAllProductForWeb = async (req, res, next) => {
    try {
        const productDetails = await product_model_1.Product.find({ isDeleted: false }).sort({ createdAt: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Product', true, 200, productDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllProductForWeb = getAllProductForWeb;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to hot selling for web
 */
let hotSellingForWeb = async (req, res, next) => {
    try {
        const productList = await product_model_1.Product.find({ $and: [{ selling: "hot" }, { isDeleted: false }] }).sort({ createdOn: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.hotSellingForWeb = hotSellingForWeb;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered Product For Web
 */
let getFilteredProductForWeb = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const productList = await product_model_1.Product.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page);
        const productCount = await product_model_1.Product.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList, productCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredProductForWeb = getFilteredProductForWeb;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save product for company
 */
let saveProductForCompany = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const productDetails = req.body;
            const { originalPrice, discountPercentage, gstRate, specifications: rawSpecifications } = productDetails;
            const finalPrice = Number(originalPrice) + Number((Number(originalPrice) * Number(gstRate)) / 100); // gst will be added
            productDetails.finalPrice = Math.round(Number(finalPrice));
            const discountedPrice = Number(finalPrice) - Number(Number(finalPrice) * Number(discountPercentage) / 100); // discount will be added
            productDetails.discountedPrice = Math.round(Number(discountedPrice));
            let specifications = [];
            if (Array.isArray(rawSpecifications)) {
                specifications = rawSpecifications.map((spec) => ({
                    heading: spec.heading,
                    points: spec.points,
                }));
            }
            const createData = new product_model_1.Product(productDetails);
            const insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Product', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Product', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveProductForCompany = saveProductForCompany;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to product rating
 */
let productRating = async (req, res, next) => {
    const { _id, rating } = req.body;
    // const userId = req.headers['authorization'];
    try {
        const productDetails = await product_model_1.Product.findOneAndUpdate({ _id: _id }, {
            $set: {
                rating: rating,
                // title: req.body.title,
                // userId: req.body.userId,
                // comment: req.body.comment,
                // images: req.body.images,
                modifiedOn: new Date(),
                modifiedBy: req.body.modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Product-Rating', true, 200, productDetails, ErrorMessage_1.clientError.success.savedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Product-Rating', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.productRating = productRating;
/**
 * @author Santhosh Khan K
 * @date   10-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update specifications
 */
let updateSpecifications = async (req, res, next) => {
    try {
        const { specifications } = req.body;
        const product = await product_model_1.Product.findById(req.body._id);
        if (!product) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Specifications', false, 404, {}, ErrorMessage_1.errorMessage.notFound, 'Product not found');
        }
        if (Array.isArray(specifications)) {
            specifications.forEach((spec) => {
                const { heading, points } = spec;
                product.specifications.push({ heading, points });
            });
            await product.save();
        }
        else {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Specifications', false, 400, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Specifications must be an array');
        }
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Specifications', true, 200, product, ErrorMessage_1.clientError.success.savedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Specifications', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateSpecifications = updateSpecifications;
/**
 * @author Santhosh Khan K
 * @date   08-01-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Product
 */
let getSingleProductFoeWeb = async (req, res, next) => {
    try {
        const productDetails = await product_model_1.Product.findById({ _id: req.query._id }).sort({ createdOn: -1 }).populate('panelId', { companyName: 1 }).populate('companyId', { companyName: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Product', true, 200, productDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Product', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleProductFoeWeb = getSingleProductFoeWeb;
//# sourceMappingURL=product.controller.js.map
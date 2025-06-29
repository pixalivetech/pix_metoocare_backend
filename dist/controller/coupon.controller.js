"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCoupon = exports.useCoupon = exports.createCoupon = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const coupon_model_1 = require("../model/coupon.model");
const product_model_1 = require("../model/product.model");
const order_model_1 = require("../model/order.model");
var activity = "Coupon";
/**
* @author Santhosh Khan K / BalajiMurahari
* @date   05-12-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to create coupon.
*/
const createCoupon = async (req, res, next) => {
    try {
        const couponCode = (0, commonResponseHandler_1.generateCouponCode)();
        const newCoupon = new coupon_model_1.Coupon({
            code: couponCode,
            validFrom: new Date(),
            validTill: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Valid for 1 days
        });
        await newCoupon.save();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Coupon', true, 200, newCoupon, ErrorMessage_1.clientError.success.registerSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Coupon', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.createCoupon = createCoupon;
/**
* @author  BalajiMurahari/Santhosh Khan K
* @date   02-01-2024
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to use coupon.
*/
const useCoupon = async (req, res, next) => {
    try {
        const couponDetails = req.body;
        if (!couponDetails.code || !couponDetails.userId) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Use-Coupon', true, 422, {}, 'Invalid coupon details');
        }
        const existingCoupon = await coupon_model_1.Coupon.findOne({ $and: [{ code: couponDetails.code }, { isDeleted: false }] });
        if (!existingCoupon) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Use-Coupon', true, 404, {}, 'Coupon not found or already used');
        }
        if (existingCoupon?.usedBy.includes(couponDetails.userId)) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Use-Coupon', true, 402, {}, 'Coupon has already been used by the user');
        }
        else {
            existingCoupon?.usedBy.push(couponDetails.userId);
            await existingCoupon?.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Use-Coupon', true, 200, existingCoupon, ErrorMessage_1.clientError.success.couponUsedSuccessfully);
        }
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Use-Coupon', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.useCoupon = useCoupon;
/**
* @author BalajiMurahari/santhosh
* @date   10-01-2024
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to apply coupon for product .
*/
const applyCoupon = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const couponDetails = req.body;
            const coupon = await coupon_model_1.Coupon.findOne({ code: couponDetails.code, validTill: { $gte: new Date() } });
            if (!coupon) {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Apply-Coupon', false, 404, {}, 'Coupon not found or expired');
            }
            if (coupon?.isUsed) {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Apply-Coupon', false, 400, {}, 'Coupon already used');
            }
            if (coupon?.usedBy && coupon?.usedBy.includes(couponDetails.userId)) {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Apply-Coupon', false, 401, {}, 'Coupon already used by this user');
            }
            const productIds = couponDetails.productId; // Assuming productIds is an array of product IDs
            const products = await product_model_1.Product.find({ _id: { $in: productIds } });
            if (products.length !== productIds.length) {
                return (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Apply-Coupon', false, 402, {}, 'One or more products not found');
            }
            let totalDiscount = 0;
            for (const product of products) {
                const lastFourDigits = couponDetails.code.slice(-4);
                const couponDiscount = parseInt(lastFourDigits);
                const newDiscountedPrice = Math.max(product.discountedPrice - couponDiscount, 0);
                totalDiscount += product.discountedPrice - newDiscountedPrice;
                product.discountedPrice = newDiscountedPrice;
                await product.save();
            }
            if (!couponDetails.usedBy) {
                couponDetails.usedBy = [];
            }
            coupon?.usedBy.push(couponDetails.userId);
            await coupon?.save();
            // Assuming you have a Purchase model to represent a purchase
            const purchase = new order_model_1.Order({
                userId: couponDetails.userId,
                productIds: productIds,
                totalAmount: totalDiscount,
            });
            await purchase.save();
            const responseMessage = `Coupon applied successfully. Total discount: ${totalDiscount}`;
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Apply-Coupon', true, 200, { totalDiscount }, responseMessage);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Apply-Coupon', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
};
exports.applyCoupon = applyCoupon;
//# sourceMappingURL=coupon.controller.js.map
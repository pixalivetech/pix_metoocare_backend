import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response,generateCouponCode } from "../helper/commonResponseHandler";
import { Coupon,CouponDocument } from "../model/coupon.model";
import {Product} from "../model/product.model"
import {Order} from "../model/order.model"
import { Code } from "mongodb";

var activity = "Coupon";


/**
* @author Santhosh Khan K / BalajiMurahari
* @date   05-12-2023
* @param {Object} req 
* @param {Object} res 
* @param {Function} next  
* @description This Function is used to create coupon.
*/

export const createCoupon = async (req, res, next) => {
  try {
    const couponCode = generateCouponCode();
    const newCoupon: CouponDocument = new Coupon({
      code: couponCode,
      validFrom: new Date(),
      validTill: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Valid for 1 days
    });
    await newCoupon.save();

    response(req, res, activity, 'Level-2', 'Create-Coupon', true, 200, newCoupon, clientError.success.registerSuccessfully);
  } catch (err: any) {
   response(req, res, activity, 'Level-3', 'Create-Coupon', false, 500, {}, errorMessage.internalServer, err.message);
  }
};
/**
* @author  BalajiMurahari/Santhosh Khan K
* @date   02-01-2024
* @param {Object} req 
* @param {Object} res 
* @param {Function} next  
* @description This Function is used to use coupon.
*/

export const useCoupon = async (req, res, next) => {
try {
  const couponDetails: CouponDocument = req.body; 
   if (!couponDetails.code || !couponDetails.userId) {
    response(req, res, activity, 'Level-3', 'Use-Coupon', true, 422, {}, 'Invalid coupon details');
  }
  const existingCoupon = await Coupon.findOne({$and : [{code: couponDetails.code}, {isDeleted: false }]});
  if (!existingCoupon) {
    response(req, res, activity, 'Level-3', 'Use-Coupon', true, 404, {}, 'Coupon not found or already used');
  }
  if (existingCoupon?.usedBy.includes(couponDetails.userId)) {  
    response(req, res, activity, 'Level-3', 'Use-Coupon', true, 402, {}, 'Coupon has already been used by the user');
  }
 else {
    existingCoupon?.usedBy.push(couponDetails.userId);
    await existingCoupon?.save();
    response(req, res, activity, 'Level-2', 'Use-Coupon', true, 200, existingCoupon, clientError.success.couponUsedSuccessfully);
  }
} catch (err: any) {
  response(req, res, activity, 'Level-3', 'Use-Coupon', false, 500, {}, errorMessage.internalServer, err.message);
}
};


/**
* @author BalajiMurahari/santhosh
* @date   10-01-2024
* @param {Object} req 
* @param {Object} res 
* @param {Function} next  
* @description This Function is used to apply coupon for product .
*/







export const applyCoupon = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      const couponDetails: CouponDocument = req.body;
      const coupon = await Coupon.findOne({ code: couponDetails.code, validTill: { $gte: new Date() } });
      
      if (!coupon) {
        response(req, res, activity, 'Level-3', 'Apply-Coupon', false, 404, {}, 'Coupon not found or expired');
      }

      if (coupon?.isUsed) {
       response(req, res, activity, 'Level-3', 'Apply-Coupon', false, 400, {}, 'Coupon already used');
      }

      if (coupon?.usedBy && coupon?.usedBy.includes(couponDetails.userId)) {
       response(req, res, activity, 'Level-3', 'Apply-Coupon', false, 401, {}, 'Coupon already used by this user');
      }

      const productIds = couponDetails.productId; // Assuming productIds is an array of product IDs
      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length !== productIds.length) {
        return response(req, res, activity, 'Level-3', 'Apply-Coupon', false, 402, {}, 'One or more products not found');
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
      const purchase = new Order({
        userId: couponDetails.userId,
        productIds: productIds,
        totalAmount: totalDiscount,
      });
      await purchase.save();

      const responseMessage = `Coupon applied successfully. Total discount: ${totalDiscount}`;
     response(req, res, activity, 'Level-2', 'Apply-Coupon', true, 200, { totalDiscount }, responseMessage);
    } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Apply-Coupon', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }
}

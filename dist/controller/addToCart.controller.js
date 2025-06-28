"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductFromCart = exports.getSingleAddToCart = exports.deleteAddToCart = exports.getAllCartDetails = exports.updateAddToCart = exports.savedAddToCart = void 0;
const express_validator_1 = require("express-validator");
const addToCart_model_1 = require("../model/addToCart.model");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const product_model_1 = require("../model/product.model");
var activity = "Cart";
/**
 * @author BalajiMurahari
 * @date  21-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to manage the cart operations (increase decrease clear cart)
 * */
let savedAddToCart = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const addToCartData = req.body;
            let userCart = await addToCart_model_1.AddToCart.findOne({ userId: addToCartData.userId });
            if (!userCart) {
                userCart = await addToCart_model_1.AddToCart.create({ userId: addToCartData.userId, items: [], totalAmount: 0, totalQuantity: 0, isDeleted: false, status: 1, });
            }
            for (const newItem of addToCartData.items) { // for loop condition false it runs
                const cartItemIndex = userCart.items.findIndex((item) => String(item.productId) === String(newItem.productId)); // old product new product check
                if (cartItemIndex !== -1) { // checking product -1 or not 
                    if (newItem.operation === "decrease") { //product operation decrease means  true
                        userCart.items[cartItemIndex].quantity -= newItem.quantity; // decrease product
                        if (userCart.items[cartItemIndex].quantity <= 0) { // if quantity 0 means goes next line
                            userCart.items.splice(cartItemIndex, 1); //index 1 value it brings
                        }
                    }
                    else {
                        userCart.items[cartItemIndex].quantity += newItem.quantity; // increse product
                        userCart.items[cartItemIndex].productPrice = newItem.productPrice; // add or decrease product price
                    }
                }
                else {
                    if (newItem.operation !== "decrease") { // operation not decrease means true 
                        const productDetails = await product_model_1.Product.findById(newItem.productId); // Fetch product details based on product ID
                        if (!productDetails) { // product not means console error
                            console.error(`Error: Product not found for productId ${newItem.productId}`); // Log the error message, but don't modify the item
                            continue;
                        }
                        userCart.items.push({
                            productId: newItem.productId,
                            panelId: productDetails.panelId,
                            companyId: productDetails.companyId,
                            quantity: newItem.quantity,
                            productPrice: newItem.productPrice,
                            productName: productDetails.productName,
                            productImage: productDetails.productImage,
                            originalPrice: productDetails.originalPrice,
                            discountPercentage: productDetails.discountPercentage,
                            discountedPrice: productDetails.discountedPrice,
                            gstRate: productDetails.gstRate,
                            gstAmount: productDetails.gstAmount,
                            finalPrice: productDetails.finalPrice,
                            selling: "",
                        });
                    }
                }
            }
            userCart.totalAmount = Math.max(0, userCart.items.reduce((total, item) => total + item.quantity * item.productPrice, 0)); // calculate total amount & product quantity
            userCart.totalQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0);
            if (userCart.totalQuantity <= 0) // clearcart this lines
             {
                userCart.totalAmount = 0;
                userCart.totalQuantity = 0;
                userCart.items = [];
            }
            if (userCart.items.length > 0 || userCart.totalQuantity > 0 || userCart.totalAmount > 0) { // update the condition and save
                const updatedCart = await userCart.save();
                const populatedItems = await Promise.all(updatedCart.items.map(async (item) => {
                    return {
                        ...item,
                        productName: item.productName,
                        productImage: item.productImage,
                    };
                }));
                updatedCart.items = populatedItems;
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, updatedCart, ErrorMessage_1.clientError.success.fetchedSuccessfully);
            }
            else {
                await addToCart_model_1.AddToCart.findByIdAndDelete(userCart._id);
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, userCart, ErrorMessage_1.clientError.success.fetchedSuccessfully);
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Invalid data in the request');
    }
};
exports.savedAddToCart = savedAddToCart;
/**
 * @author BalajiMurahari
 * @date   24-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to orderplace
 */
const updateAddToCart = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const addToCartData = req.body;
            let userCart = await addToCart_model_1.AddToCart.findOne({ userId: addToCartData.userId });
            if (userCart) {
                addToCartData.items.forEach((purchasedItem) => {
                    const existingItem = userCart.items.find((item) => item.productId === purchasedItem.productId);
                    if (existingItem) { // Update product quantity, product price, and total quantity
                        existingItem.quantity -= purchasedItem.quantity;
                        existingItem.productPrice = purchasedItem.productPrice;
                        userCart.totalQuantity -= purchasedItem.quantity;
                        if (existingItem.quantity <= 0) { //  quantity becomes zero, remove the item in db
                            userCart.items = userCart.items.filter((item) => item.productId !== existingItem.productId);
                            userCart.totalQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0); // Recalculate total quantity and total amount
                            userCart.totalAmount = userCart.items.reduce((total, item) => total + item.quantity * item.productPrice, 0);
                        }
                        else { // Update total amount with existing item's information
                            const itemQuantity = existingItem.quantity || 0;
                            const itemPrice = existingItem.productPrice || 0;
                            userCart.totalAmount -= itemQuantity * itemPrice;
                        }
                    }
                });
                await userCart.save();
                if (userCart.totalQuantity === 0 && userCart.totalAmount === 0) { // Check if both total quantity and total amount are zero, then remove the user cart
                    await addToCart_model_1.AddToCart.deleteOne({ userId: addToCartData.userId }); // You can also return a message indicating that the cart has been deleted
                }
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', true, 200, userCart, ErrorMessage_1.clientError.success.fetchedSuccessfully);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 404, {}, ErrorMessage_1.errorMessage.notFound, 'User\'s cart not found');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateAddToCart = updateAddToCart;
/**
 * @author BalajiMurahari
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all add to cart
 */
let getAllCartDetails = async (req, res, next) => {
    try {
        const addDetails = await addToCart_model_1.AddToCart.find({ userId: req.query.userId });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, addDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCartDetails = getAllCartDetails;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete add to cart
 */
let deleteAddToCart = async (req, res, next) => {
    try {
        const addDetails = await addToCart_model_1.AddToCart.deleteOne({ _id: req.body._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, addDetails, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteAddToCart = deleteAddToCart;
/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get single add to cart
 */
let getSingleAddToCart = async (req, res, next) => {
    try {
        const addDetails = await addToCart_model_1.AddToCart.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, addDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleAddToCart = getSingleAddToCart;
/**
 * @author BalajiMurahari
 * @date   20-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete a single product from the cart
 */
const deleteProductFromCart = async (req, res, next) => {
    try {
        const addToCartData = req.body;
        const cart = await addToCart_model_1.AddToCart.findOne({ _id: addToCartData._id });
        if (!cart) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', false, 404, {}, 'Cart not found', false);
        }
        const productIndex = cart.items.findIndex(item => item.productId.toString() === addToCartData.productId);
        if (productIndex === -1) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', false, 404, {}, 'Product not found in the cart', false);
        }
        const removedItem = cart.items[productIndex];
        cart.items.splice(productIndex, 1);
        cart.totalAmount = Math.round(Math.max(0, cart.totalAmount - (removedItem.productPrice * removedItem.quantity || 0)));
        cart.totalQuantity = Math.max(0, cart.totalQuantity - removedItem.quantity || 0);
        await cart.save();
        if (cart.totalQuantity === 0 && cart.totalAmount === 0) {
            await addToCart_model_1.AddToCart.deleteOne({ _id: cart._id });
        }
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', true, 200, { cart }, 'Product removed from the cart successfully', false);
    }
    catch (err) {
        console.error(err);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', false, 500, {}, 'Internal Server Error', false);
    }
};
exports.deleteProductFromCart = deleteProductFromCart;
//# sourceMappingURL=addToCart.controller.js.map
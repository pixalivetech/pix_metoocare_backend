"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.paymentOrder = exports.updateOrderPaymentStatus = exports.updateOrderStatus = exports.getFilteredOrder = exports.trackTrakingNumber = exports.trackOrderNumber = exports.cancelOrReturnOrder = exports.getSingleOrder = exports.updateOrder = exports.deleteOrder = exports.getAllOrder = exports.saveOrder = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const order_model_1 = require("../model/order.model");
const coupon_model_1 = require("../model/coupon.model");
const product_model_1 = require("../model/product.model");
const luxon_1 = require("luxon");
const cashfree_pg_1 = require("cashfree-pg");
// Configure Cashfree credentials
cashfree_pg_1.Cashfree.XClientId = process.env.ClientId;
cashfree_pg_1.Cashfree.XClientSecret = process.env.ClientSecret;
cashfree_pg_1.Cashfree.XEnvironment = cashfree_pg_1.Cashfree.Environment.PRODUCTION;
var activity = "Order";
/**
 *  @author Santhosh Khan K
 *  @date   14-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to save Order
 * */
let saveOrder = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const orderDetails = req.body;
            const { couponCode, userId } = orderDetails;
            const orderNumber = (0, commonResponseHandler_1.generateOrderNumber)();
            orderDetails.orderNumber = orderNumber;
            orderDetails.products.forEach(product => {
                const trackingNumber = (0, commonResponseHandler_1.generateTrackingNumber)();
                product.trackingNumber = trackingNumber;
            });
            if (couponCode) {
                const existingCouponUsage = await coupon_model_1.Coupon.findOne({ userId, couponCode });
                if (existingCouponUsage) {
                    if (!res.headersSent) {
                        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Order', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, 'Coupon code has already been used by the user');
                    }
                }
                if (couponCode.length >= 4) {
                    const lastFourDigits = couponCode.slice(-4);
                    const discountPerProduct = parseInt(lastFourDigits) / orderDetails.products.length;
                    orderDetails.products.forEach((product) => {
                        product.discountedPrice -= discountPerProduct;
                    });
                }
            }
            let totalPrice = orderDetails.products.reduce((total, product) => total + product.discountedPrice, 0);
            orderDetails.deliveryCharges = totalPrice >= 499 ? 0 : 50;
            orderDetails.totalAmount = totalPrice + orderDetails.deliveryCharges;
            const currentTime = luxon_1.DateTime.utc().setZone('Asia/Kolkata');
            orderDetails.orderPlacedOn = currentTime.toISO();
            const invoiceNumber = (0, commonResponseHandler_1.generateInvoiceNumber)();
            orderDetails.invoiceNumber = invoiceNumber.toString();
            const invoice = await (0, commonResponseHandler_1.generateInvoice)(orderDetails, invoiceNumber);
            // Update product quantities in the database
            for (const product of orderDetails.products) {
                const existingProduct = await product_model_1.Product.findById(product.productId);
                if (existingProduct) {
                    existingProduct.quantity -= product.quantity;
                    await existingProduct.save();
                }
            }
            orderDetails.products.forEach((product) => {
                product.invoice = invoice.toString();
            });
            const createData = new order_model_1.Order(orderDetails);
            const insertedData = await createData.save();
            if (couponCode) {
                const newCouponUsage = new coupon_model_1.Coupon({ userId, couponCode });
                await newCouponUsage.save();
            }
            if (!res.headersSent) {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Order', true, 200, { insertedData, invoiceNumber }, ErrorMessage_1.clientError.success.savedSuccessfully);
            }
        }
        catch (err) {
            if (!res.headersSent) {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
            }
        }
    }
    else {
        if (!res.headersSent) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Order', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
        }
    }
};
exports.saveOrder = saveOrder;
/**
 *
 *  @author Santhosh Khan K
 *  @date   14-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to get all orders
 * */
let getAllOrder = async (req, res, next) => {
    try {
        const orderDetails = await order_model_1.Order.find({ isDeleted: false }).sort({ modifiedOn: -1 }).populate({ path: 'products.panelId', select: 'companyName', }).populate({ path: 'products.companyId', select: 'companyName', });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Order', true, 200, orderDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllOrder = getAllOrder;
/**
 *
 * @author Santhosh Khan K
 * @date   14-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete order
 * */
let deleteOrder = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        const order = await order_model_1.Order.findOneAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Order', true, 200, order, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteOrder = deleteOrder;
/**
 *
 * @author Santhosh Khan K
 * @date   14-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update order
 * */
let updateOrder = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const orderDetails = req.body;
            const updateData = await order_model_1.Order.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    modifiedOn: orderDetails.modifiedOn,
                    modifiedBy: orderDetails.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Order', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Order', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateOrder = updateOrder;
/**
 *
 * @author Santhosh Khan K
 * @date   14-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get order
 * */
let getSingleOrder = async (req, res, next) => {
    try {
        const orderDetails = await order_model_1.Order.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-Order', true, 200, orderDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleOrder = getSingleOrder;
/**
 *
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to cancel order
 * */
let cancelOrReturnOrder = async (req, res, next) => {
    const { orderNumber, trackingNumber, productStatus } = req.body;
    if (!orderNumber || !trackingNumber || !productStatus) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, ErrorMessage_1.errorMessage, 'Please provide orderNumber, trackingNumber, and action');
        return;
    }
    try {
        const order = await order_model_1.Order.findOne({ orderNumber });
        if (!order) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 404, {}, ErrorMessage_1.errorMessage, 'Order not found');
            return;
        }
        const product = order.products.find((product) => product.trackingNumber === trackingNumber);
        if (!product) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 404, {}, ErrorMessage_1.errorMessage, 'Product not found');
            return;
        }
        // Check if the order is already canceled or returned
        if (product.productStatus === 'canceled') {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, ErrorMessage_1.errorMessage, 'Order already canceled');
            return;
        }
        // Perform the specified action
        if (productStatus === 'cancel') {
            if (product.canceled) {
                // If the return order is completed, disallow canceling
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, ErrorMessage_1.errorMessage, 'Cannot cancel a returned order');
                return;
            }
            else {
                // If no return is initiated, allow direct cancellation
                product.productStatus = 'canceled';
                product.canceled = true;
            }
        }
        else if (productStatus === 'return') {
            // Check if the order is canceled before allowing a return
            if (product.canceled) {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, ErrorMessage_1.errorMessage, 'Cannot initiate return for a canceled order');
                return;
            }
            else if (product.returned) {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, ErrorMessage_1.errorMessage, 'Cannot initiate return for a returned order');
            }
            else {
                product.productStatus = 'returned';
                product.returned = true;
            }
        }
        else {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, ErrorMessage_1.errorMessage, 'Invalid action');
            return;
        }
        await order.save();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', true, 200, order, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.cancelOrReturnOrder = cancelOrReturnOrder;
/**
 *
 *  @author Santhosh Khan K
 *  @date   26-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to track order
 * */
let trackOrderNumber = async (req, res, next) => {
    try {
        const { orderNumber } = req.body;
        const order = await order_model_1.Order.findOne({ orderNumber });
        if (!order) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Track-Order', false, 404, {}, ErrorMessage_1.errorMessage, 'Order not found');
        }
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Track-Order', true, 200, order, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Track-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.trackOrderNumber = trackOrderNumber;
/**
*
*  @author Santhosh Khan K
*  @date   26-10-2023
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to track order
* */
let trackTrakingNumber = async (req, res, next) => {
    try {
        const { trackingNumber } = req.body;
        const order = await order_model_1.Order.findOne({ trackingNumber });
        if (!order) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Track-Order', false, 404, {}, ErrorMessage_1.errorMessage, 'Order not found');
        }
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Track-Order', true, 200, order, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Track-Order', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.trackTrakingNumber = trackTrakingNumber;
/**
* @author Santhosh Khan K
* @date   27-10-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get Filtered Order
*/
let getFilteredOrder = async (req, res, next) => {
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
        if (req.body.userId) {
            andList.push({ userId: req.body.userId });
        }
        if (req.body.orderNumber) {
            andList.push({ orderNumber: { orderNumber: req.body.orderNumber } });
        }
        if (req.body.trackingNumber) {
            andList.push({ trackingNumber: req.body.trackingNumber });
        }
        if (req.body.orderStatus) {
            andList.push({ orderStatus: req.body.orderStatus });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const orderList = await order_model_1.Order.find().sort({ createdAt: -1 }).limit(limit).skip(page);
        const orderCount = await order_model_1.Order.find().count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { orderList, orderCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredOrder = getFilteredOrder;
/**
*
*  @author Santhosh Khan K
*  @date   30-10-2023
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to update order status
* */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId, newStatus } = req.body;
        const order = await order_model_1.Order.findOneAndUpdate({ 'products._id': orderId }, { $set: { 'products.$.orderStatus': newStatus } }, { new: true });
        if (!order) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Order-Status', false, 404, {}, ErrorMessage_1.errorMessage.internalServer, 'Order not found');
        }
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Order-Status', true, 200, order, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Order-Status', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateOrderStatus = updateOrderStatus;
/**
*
*  @author Santhosh Khan K
*  @date   21-11-2023
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to update order payment status
* */
let updateOrderPaymentStatus = async (req, res, next) => {
    try {
        const { orderId, newStatus } = req.body;
        const order = await order_model_1.Order.findByIdAndUpdate(orderId, { paymentStatus: newStatus }, { new: true });
        if (!order) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Order-Payment-Status', false, 404, {}, ErrorMessage_1.errorMessage.internalServer, 'Order not found');
        }
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Order-Payment-Status', true, 200, order, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Order-Payment-Status', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateOrderPaymentStatus = updateOrderPaymentStatus;
const paymentOrder = async (req, res, next) => {
    try {
        const orderId = req.body._id; // Get orderId from request body
        // Fetch order details from database
        const order = await order_model_1.Order.findOne({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if the order amount exceeds the maximum allowed by Cashfree
        // const maxOrderAmount = 15000; // Example: Maximum order amount allowed by Cashfree
        const orderAmount = parseFloat(order.totalAmount); // Convert order amount to number
        // if (orderAmount > maxOrderAmount) {
        //     return res.status(400).json({ message: "Order amount exceeds maximum allowed" });
        // }
        const return_url = process.env.Return_Url;
        const paymentRequest = {
            order_amount: orderAmount, // Use orderAmount which is a number
            order_currency: "INR",
            order_id: await (0, commonResponseHandler_1.generateOrderId)(), // Generate order ID
            customer_details: {
                customer_id: order.userId.toString(), // Convert ObjectId to string
                customer_phone: order.ShippingAddress[0].mobileNumber,
                customer_name: order.ShippingAddress[0].name,
                customer_email: order.ShippingAddress[0].email
            },
            order_meta: {
                return_url: return_url,
                // notify_url: notify_url
            },
            order_note: ""
        };
        const response = await cashfree_pg_1.Cashfree.PGCreateOrder("2023-08-01", paymentRequest);
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to initiate payment", error: error.response.data });
    }
};
exports.paymentOrder = paymentOrder;
// Function to handle payment response
const verifyPayment = async (req, res, next) => {
    try {
        const orderId = req.query.orderId;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        const response = await cashfree_pg_1.Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        console.log("Response data:", response.data);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error handling payment response:', error);
        res.status(500).json({ message: 'Failed to handle payment response', error: error.message });
    }
};
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=order.controller.js.map
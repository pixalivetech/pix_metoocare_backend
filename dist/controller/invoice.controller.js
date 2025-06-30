"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = exports.getFilterInvoice = exports.getSingleInvoice = exports.deleteInvoice = exports.updateInvoice = exports.generateInvoiceCopy = exports.getAllInvoice = exports.getInvoiceNumber = void 0;
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const order_model_1 = require("../model/order.model");
var activity = 'Invoice';
/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Invoice Number.
 */
let getInvoiceNumber = async (req, res, next) => {
    try {
        const data = await order_model_1.Order.find({ isDeleted: false }).populate('products.panelId', { name: 1, companyName: 1, email: 1, city: 1, state: 1, mobileNumber: 1, companyAddress: 1, }).populate('products.companyId', { name: 1, companyName: 1, email: 1, city: 1, state: 1, mobileNumber: 1, companyAddress: 1, });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetInvoice-Number', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetInvoice-Number', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getInvoiceNumber = getInvoiceNumber;
/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Invoice.
 */
let getAllInvoice = async (req, res, next) => {
    try {
        const data = await order_model_1.Order.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Invoice', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllInvoice = getAllInvoice;
/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save invoice.
//  */
let generateInvoiceCopy = async (req, res, next) => {
    try {
        const orderData = req.body;
        const invoice = {
            orderNumber: orderData.orderNumber,
            totalAmount: orderData.totalAmount,
        };
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Generate-Invoice', true, 200, invoice, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Generate-Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.generateInvoiceCopy = generateInvoiceCopy;
/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Invoice.
//  */
let updateInvoice = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails = req.body;
            const updateInvoice = new order_model_1.Order(invoiceDetails);
            let updateData = await updateInvoice.updateOne({
                $set: {
                    orderNumber: invoiceDetails.orderNumber,
                    totalAmount: invoiceDetails.totalAmount,
                    modifiedOn: invoiceDetails.modifiedOn,
                    modifiedBy: invoiceDetails.modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Invoice', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Invoice', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateInvoice = updateInvoice;
/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Invoice.
 */
let deleteInvoice = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await order_model_1.Order.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Invoice', true, 200, data, ErrorMessage_1.clientError.success.deleteSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Invoice', true, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteInvoice = deleteInvoice;
/**
 * @author Santhosh Khan K
 * @date 20-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get single invoice.
 */
let getSingleInvoice = async (req, res, next) => {
    try {
        const data = await order_model_1.Order.findById({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-SingleInvoice', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-SingleInvoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleInvoice = getSingleInvoice;
/**
* @author Santhosh Khan K
* @date 20-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to get filter invoice.
*/
let getFilterInvoice = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const invoiceList = await order_model_1.Order.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('client', { name: 1 }).populate('project', { title: 1 }).populate('resource', { projectTitle: 1 });
        const invoiceCount = await order_model_1.Order.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterInvoice', true, 200, { invoiceList, invoiceCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterInvoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterInvoice = getFilterInvoice;
/**
* @author Santhosh Khan K
* @date 20-11-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to generate invoice.
*/
const generateInvoice = async (req, res, next) => {
    try {
        const orderData = req.body;
        const invoice = {
            orderNumber: orderData.orderNumber,
            totalAmount: orderData.totalAmount,
        };
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Generate-Invoice', true, 200, invoice, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Generate-Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.generateInvoice = generateInvoice;
//# sourceMappingURL=invoice.controller.js.map
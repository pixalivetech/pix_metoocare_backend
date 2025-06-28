"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnviewedNotification = exports.updateNotificationView = exports.getFilterNotification = exports.saveNotification = exports.getAllNotification = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const notification_model_1 = require("../model/notification.model");
var activity = "Notification";
/**
 * @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Notification.
 */
let getAllNotification = async (req, res, next) => {
    try {
        const data = await notification_model_1.Notification.find({ isDeleted: false }).populate('from.user', { name: 1, profileImage: 1 }).sort({ date: -1 }).limit(30);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Notification', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Notification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllNotification = getAllNotification;
/**
* @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save notification.
 */
let saveNotification = async (data) => {
    try {
        const notificationDetails = data;
        let date = new Date();
        notificationDetails.date = date;
        const createData = new notification_model_1.Notification(notificationDetails);
        let insertData = await createData.save();
    }
    catch (err) {
        console.log(err);
    }
};
exports.saveNotification = saveNotification;
/**
* @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Company Notification.
 */
let getFilterNotification = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        if (req.body.to) {
            andList.push({ 'to.user': req.body.to });
        }
        if (req.body.title) {
            andList.push({ title: { $in: req.body.title } });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const notificationList = await notification_model_1.Notification.find(findQuery).sort({ date: -1 }).limit(limit).skip(page); //.populate('from.user', { name: 1, image: 1 })
        const notificationCount = await notification_model_1.Notification.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterNotification', true, 200, { notificationList, notificationCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterNotification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilterNotification = getFilterNotification;
/**
 * @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update notification view.
 */
let updateNotificationView = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            let { modifiedOn, modifiedBy } = req.body;
            let updateData = await notification_model_1.Notification.updateMany({ $and: [{ isViewed: false }, { 'to.user': req.body.loginId }] }, {
                $set: {
                    isViewed: true,
                    modifiedOn: modifiedOn,
                    modifiedBy: modifiedBy
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-NotificationView', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-NotificationView', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-NotificationView', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateNotificationView = updateNotificationView;
/**
 * @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get unviewed Notification Count.
 */
let getUnviewedNotification = async (req, res, next) => {
    try {
        const data = await notification_model_1.Notification.find({ $and: [{ isDeleted: false }, { isViewed: false }, { 'to.user': req.body.loginId }] }, { _id: 1 });
        const result = data.length;
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-UnviewedNotification', true, 200, result, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-UnviewedNotification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getUnviewedNotification = getUnviewedNotification;
//# sourceMappingURL=notification.controller.js.map
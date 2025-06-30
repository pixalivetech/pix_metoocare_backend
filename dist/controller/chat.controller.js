"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChats = exports.getDoctorChats = exports.getUserSentChats = exports.doctorSendMessages = exports.userSendMessages = void 0;
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const chat_models_1 = require("../model/chat.models");
const luxon_1 = require("luxon");
var activity = "chatuser";
/**
 * @author Balaji Murahari/ Santhosh Khan K
 * @date   07-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create chat for users
 */
const userSendMessages = async (req, res, next) => {
    try {
        const chatDetails = req.body;
        if (!chatDetails.userId || !chatDetails.doctorId) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
        }
        if (chatDetails.userId === chatDetails.doctorId) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Chat', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, 'Cannot send message to yourself');
        }
        const currentTime = luxon_1.DateTime.utc().setZone('Asia/Kolkata');
        chatDetails.sentOn = currentTime.toISO();
        const senderType = 'user';
        const newMessage = await chat_models_1.ChatMessage.create({
            userId: chatDetails.userId,
            doctorId: chatDetails.doctorId,
            message: chatDetails.message,
            senderType: senderType,
        });
        const io = req.app.get('socketio');
        if (io) {
            io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
            io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
        }
        await newMessage.save();
        const sentOnTime = new Date(chatDetails.sentOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, ErrorMessage_1.clientError.success.fetchedSuccessfully, { sentOnTime });
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Chat', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.userSendMessages = userSendMessages;
/**
 * @author Balaji Murahari / Santhosh Khan K
 * @date   07-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create chat for doctors
 */
const doctorSendMessages = async (req, res, next) => {
    try {
        const chatDetails = req.body;
        if (!chatDetails.userId || !chatDetails.doctorId) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
        }
        if (chatDetails.userId === chatDetails.doctorId) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Chat', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, 'Cannot send message to yourself');
        }
        const currentTime = luxon_1.DateTime.utc().setZone('Asia/Kolkata');
        chatDetails.sentOn = currentTime.toISO();
        const senderType = 'doctor';
        const newMessage = await chat_models_1.ChatMessage.create({
            userId: chatDetails.userId,
            doctorId: chatDetails.doctorId,
            message: chatDetails.message,
            senderType: senderType,
        });
        const io = req.app.get('socketio');
        if (io) {
            io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
            io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
        }
        await newMessage.save();
        const sentOnTime = new Date(chatDetails.sentOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, ErrorMessage_1.clientError.success.fetchedSuccessfully, { sentOnTime });
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Chat', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.doctorSendMessages = doctorSendMessages;
/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get messages
 */
const getUserSentChats = async (req, res, next) => {
    try {
        const { userId } = req.query;
        const userSentChats = await chat_models_1.ChatMessage.find({ userId, senderType: 'user', }).populate('userId', { name: 1, profileImage: 1 }).populate('doctorId', { doctorName: 1, profileImage: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Chat', true, 200, userSentChats, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Chat', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getUserSentChats = getUserSentChats;
/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get messages
 */
let getDoctorChats = async (req, res, next) => {
    try {
        const { doctorId } = req.query;
        const doctorSentDetails = await chat_models_1.ChatMessage.find({ doctorId, senderType: 'doctor', }).populate('userId', { name: 1, profileImage: 1 }).populate('doctorId', { doctorName: 1, profileImage: 1 });
        ;
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Chat', true, 200, doctorSentDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Chat', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getDoctorChats = getDoctorChats;
/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all messages
 */
let getAllChats = async (req, res, next) => {
    try {
        const chatDetails = await chat_models_1.ChatMessage.find({ isDeleted: false }).populate('userId', { name: 1, profileImage: 1 }).populate('doctorId', { doctorName: 1, profileImage: 1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Chat', true, 200, chatDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Chat', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllChats = getAllChats;
// export const doctorSendMessages = async (req, res, next) => {
//   try {
//     const chatDetails: chatMessageDocument = req.body;
//     if(!chatDetails.userId || !chatDetails.doctorId){
//       response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'userId and doctorId are required');
//     }
//   const currentTime = DateTime.utc().setZone('Asia/Kolkata');
//   chatDetails.sentOn = currentTime.toISO();
//     let senderType = 'doctor';
//     const newMessage = await ChatMessage.create({
//       userId: chatDetails.userId,
//       doctorId: chatDetails.doctorId,
//       message: chatDetails.message,
//       senderType: senderType,
//     });
//     const io = req.app.get('socketio');
//     if (io) {
//       io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
//       io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
//     }
//       await newMessage.save();
//       const sentOnTime = new Date(chatDetails.sentOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
//   } catch (err:any) {
//     response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };
//# sourceMappingURL=chat.controller.js.map
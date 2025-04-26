import { response } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
import { ChatMessage, chatMessageDocument } from '../model/chat.models';
import {DateTime} from 'luxon';

var activity = "chatuser";


/**
 * @author Balaji Murahari/ Santhosh Khan K
 * @date   07-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create chat for users
 */
export const userSendMessages = async (req, res, next) => {
  try {
    const chatDetails = req.body;
    if (!chatDetails.userId || !chatDetails.doctorId) {
      response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
    }
    if (chatDetails.userId === chatDetails.doctorId) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
    }

    const currentTime = DateTime.utc().setZone('Asia/Kolkata');
  chatDetails.sentOn = currentTime.toISO();

    const senderType = 'user';
    const newMessage = await ChatMessage.create({
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
    response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
  } catch (err:any) {
   response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
};


/**
 * @author Balaji Murahari / Santhosh Khan K
 * @date   07-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create chat for doctors
 */

export const doctorSendMessages = async (req, res, next) => {
  try {
    const chatDetails = req.body;
    if (!chatDetails.userId || !chatDetails.doctorId) {
      response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
    }
    if (chatDetails.userId === chatDetails.doctorId) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
    }

    const currentTime = DateTime.utc().setZone('Asia/Kolkata');
  chatDetails.sentOn = currentTime.toISO();

    const senderType = 'doctor';
    const newMessage = await ChatMessage.create({
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
    response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
  } catch (err:any) {
   response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
};


/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get messages
 */


    export const getUserSentChats = async (req, res, next) => {
      try {
        const { userId } = req.query;
        const userSentChats = await ChatMessage.find({userId,senderType: 'user',}).populate('userId',{name:1,profileImage:1}).populate('doctorId',{doctorName:1,profileImage:1}); 
    
        response(req, res, activity, 'Level-2', 'Chat', true, 200, userSentChats, clientError.success.fetchedSuccessfully);
      } catch (err:any) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
      }

};

/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get messages
 */

export let getDoctorChats = async (req, res, next) => {
  try{
    const { doctorId } = req.query;
    const doctorSentDetails = await ChatMessage.find({doctorId,senderType: 'doctor',}).populate('userId',{name:1,profileImage:1}).populate('doctorId',{doctorName:1,profileImage:1});;
    response(req, res, activity, 'Level-2', 'Chat', true, 200, doctorSentDetails, clientError.success.fetchedSuccessfully);
  }
  catch(err:any){
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }

}

/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all messages
 */
export let getAllChats = async (req, res, next) => {
  try{
    const chatDetails = await ChatMessage.find({isDeleted: false}).populate('userId',{name:1,profileImage:1}).populate('doctorId',{doctorName:1,profileImage:1});
    response(req, res, activity, 'Level-2', 'Chat', true, 200, chatDetails, clientError.success.fetchedSuccessfully);
  }
  catch(err:any){
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
}





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
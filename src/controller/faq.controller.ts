import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Faq, FaqDocument } from '../model/faq.models';
import { Doctor,DoctorDocument } from '../model/doctor.model';
import { Users , UsersDocument} from '../model/users.model';
import { response,notifyDoctor } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
import { notifyUser } from '../utils/notification';
import * as mongoose from 'mongoose';

var activity = 'Faq';


/**
 * @author BalajiMurahari
 * @date 06-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to  doctor answer to users questions
 */

export const saveFaq = async (req, res, next) => {
  const errors = validationResult(req);
    if (errors.isEmpty()){
    try {
      const { question, userId } = req.body;

      const availableDoctors = await Doctor.find({ isDeleted: false }, '_id');
      const doctorIds = availableDoctors.map((doctor) => doctor._id);

      const newQuestion = new Faq({ question, userId, doctorIds });
      await newQuestion.save();

      for (const doctorId of doctorIds) {
        try {
          await notifyDoctor(doctorId, question, userId);
        } catch (notifyError) {
          console.error('Error notifying doctor:', notifyError);
        }
      }
      const responsePayload = {
        ...newQuestion.toObject(),
        doctorIds,
      };

      response(req, res, 'Save-Faq', 'Level-2', 'Save-Faq', true, 200, responsePayload, clientError.success.savedSuccessfully);
    } catch (err: any) {
      response(req, res, 'Save-Faq', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
    }
  } else {
    response(req, res, 'Save-Faq', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
  }
};

/**
 * @author BalajiMurahari
 * @date 08-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to doctor reply to users questions
 */

export const replydoctor = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      response(req, res, activity, 'Reply-To-Question', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
      // return;
    }

    const faqDetails: FaqDocument = req.body;
    const { _id, doctorId, answer } = faqDetails;

    const faq: FaqDocument = await Faq.findById(_id);

    if (!faq) {
      response(req, res, activity, 'Reply-To-Question', 'Level-3', false, 422, {}, errorMessage.fieldValidation, 'Faq not found');
       return;
    }

    const doctorIdAsObjectId = new mongoose.Types.ObjectId(doctorId.toString());
   const doctor: DoctorDocument = await Doctor.findById(doctorIdAsObjectId);

    if (!doctor) {
      response(req, res, activity, 'Reply-To-Question', 'Level-3', false, 422, {}, errorMessage.fieldValidation, 'Doctor not found');
       return;
    }

    faq.answer = answer;
    await faq.save();

    try {
      await notifyUser(faq.userId.toString(), answer, doctorIdAsObjectId.toString());
    } catch (notifyError) {
      console.error('Error sending notification:', notifyError.message);
    }
    
    const responsePayload = {
      faqId: _id,
      answer,
      doctorId,
    };

    response(req, res, activity, 'Level-2', 'Reply-To-Question', true, 200, responsePayload, clientError.success.replySentSuccessfully);
  } catch (err: any) {
    response(req, res, activity, 'Level-3', 'Reply-To-Question', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

   /**
 * @author Balaji Murahari
 * @date 06-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get a single Users.
 */
   export let getSingleUser = async (req, res, next) => {
    try {
        const faqData = await  Faq.findById({_id:req.query._id}).populate('userId',{name:1})
       response(req,res,activity,'Level-2','Get-SingleFaq',true,200,faqData,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
       response(req,res,activity,'Level-3','Get-SingleFaq',false,500,{},errorMessage.internalServer,err.message)
        
    }
}



/**
 * @author Balaji Murahari
 * @date 08-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filtered .
 */
export let getFilterFaq = async (req, res, next) => {
  try {
         var findQuery;
         var andList: any = [];
         var limit = req.body.limit ? req.body.limit : 0;
         var page = req.body.page ? req.body.page : 0;
         andList.push({ isDeleted: false })
         andList.push({ status: 1 })
         andList.push({ user: req.body.loginId })
       
      findQuery = (andList.length > 0) ? { $and: andList } : {}
      const faqList = await Faq.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('userId',{ name:1}).populate('doctorId',{doctorName:1});
      const faqCount = await Faq.find(findQuery).count();
    response(req,res,activity,  'Level-2', 'Get-FilteredFaq', true, 200, {faqList,faqCount}, clientError.success.fetchedSuccessfully); 
  } catch (err:any) {
      response(req, res, activity, 'Level-3', 'Get-FilteredFaq', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

/**
 * @author BalajiMurahari
 * @date 06-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to  delete user.
 */

export let deleteFaq = async (req, res, next) => {
  try {
    const { modifiedBy, modifiedOn } = req.body;
    const faq = await Faq.findByIdAndUpdate({ _id: req.body._id }, {
      $set: {
        isDeleted: true,
        modifiedBy: modifiedBy,
        modifiedOn: modifiedOn
      }
    })
    response(req, res, activity, 'Level-2', 'Delete-Faq', true, 200, faq, clientError.success.deleteSuccess);
  } catch (err:any) {
    response(req, res, activity, 'Level-3', 'Delete-Faq', false, 500, {}, errorMessage.internalServer, err.message);
  }
}


/**
 * @author Santhosh Khan K
 * @date 11-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all user 
 */


export let getAllFaq = async (req, res, next) => {
  try {
    const userList = await Faq.find({isDeleted:false}).populate('userId',{name:1}).populate('doctorId',{name:1});
    response(req, res, activity, 'Level-1', 'Get-AllUser', true, 200, userList, clientError.success.fetchedSuccessfully);
  } catch (err:any) {
    response(req, res, activity, 'Level-3', 'Get-AllUser', false, 500, {}, errorMessage.internalServer, err.message);
  }
}


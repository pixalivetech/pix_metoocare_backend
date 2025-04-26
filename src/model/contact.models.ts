import mongoose from "mongoose";

export interface ContactDocument extends mongoose.Document{
    _id?:String;
    name?:String;
    email?:String;
    mobileNumber?:Number;
    messages?:String;
    status?:Number;
    isDeleted?:Boolean;
    createdOn?:Date;
    createdBy?:String;
    modifiedOn?:Date;
    modifiedBy?:String;

}

const ContactSchema= new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    mobileNumber:{type:Number,required:true},
    messages:{type:String,required:true},
    status: {type:Number,default:1},
    isDeleted: {type: Boolean,default: false},
    createdOn: {type: Date},
    createdBy: {type: String},
    modifiedOn: {type: Date},
    modifiedBy: {type: String},
})
export const Contact= mongoose.model("Contact",ContactSchema);
import { DateTime } from "luxon";
import moment = require("moment-timezone");
import mongoose from "mongoose";

export interface PaymentDocument extends mongoose.Document {
    _id: string;
    orderId: string;
    orderAmount: number;
    orderCurrency: string;
    customerId: string;
    customerPhone: string;
    customerName: string;
    customerEmail: string;
    returnUrl: string;
    orderNote: string;
    createdAt: Date;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
 
}
const paymentOrderSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true},
    orderId: { type: String, required: true },
    orderAmount: {type: Number,required: true },
    orderCurrency: { type: String, required: true },
    customerId: {type: String,required: true},
    customerPhone: {type: String,required: true},
    customerName: {type: String, required: true},
    customerEmail: {type: String,required: true},
    returnUrl: {type: String,required: true},
    orderNote: {type: String,default: '' },
    createdAt: { type: Date, default: Date.now},
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },  
    createdOn: { type: Date },
    createdBy: { type: String }
});

export const PaymentOrder = mongoose.model('PaymentOrder', paymentOrderSchema);


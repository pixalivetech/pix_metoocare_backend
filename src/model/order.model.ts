import { DateTime } from "luxon";
import moment = require("moment-timezone");
import mongoose from "mongoose";

 
 
 
export interface OrderDocument extends mongoose.Document {
    _id?: any;
    userId?: any;
    productId?: any;
    products?: any[];
    orderNumber?: string;
    invoiceNumber?: string;
    productStatus?: string;
    discountedPrice?: number;
    couponCode?: string;
    cancellationTime:any;
    couponAmount?: number;
    couponApplied?: boolean;
    cancelReason?: string;
    orderPlacedOn?: string;
    ShippingAddress?: any[];
    paymentResult?: string;
    paymentMethod?: string;
    subTotal?: number;
    taxPrice?: number;
    totalValue?: number;
    totalPrice?: number;
    totalAmount?: number;
    totalDiscount?: number;
    deliveryCharges?: number;
    isPaid?: boolean;
    isDelivered?: boolean;
    paidAt?: Date;
    deliveredAt?: Date;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
 
}
 
const orderSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose.Types.ObjectId,ref: "User" },
    products:[{
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
        panelId: { type: mongoose.Types.ObjectId, ref: "Panel" },
        productImage: { type: String },
        productName: { type: String },
        quantity: { type: Number },
        trackingNumber: { type: String },
        orderStatus: { type: String, default: ""  },
        productStatus: { type: String},
        canceled: { type: Boolean, default: false },
        cancellationTime: { type:String, default: DateTime.utc().setZone('Asia/Kolkata').toFormat('dd-MM-yyyy HH:mm:ss') },
        returned: { type: Boolean, default: false },
        price: { type: Number},
        taxPrice:{type:Number},
        discountedPrice:{type:Number,ref:"Product"},
        finalPrice:{type:Number,ref:"Product"},
        originalPrice: { type: Number,ref:"Product"},
        gstRate:{type:Number},
        invoice:{type:String},
        cancelReason:{type:String}
    }],
    orderNumber: { type: String },
    cancelStatus: { type: String },
    couponCode: { type: String },
    cancellationTime: {type: Date,default: null},
    couponAmount: { type: Number },
    coponApplied: { type: Boolean ,default:false},
    deliveryCharges:{type:Number},
    totalPrice:{type:Number},
    totalValue:{type:Number},
    totalAmount:{type:String},
    totalDiscount:{type:Number},
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    invoiceNumber: { type: String },
    orderPlacedOn: { type:String, default: DateTime.utc().setZone('Asia/Kolkata').toFormat('dd-MM-yyyy HH:mm:ss') },
    ShippingAddress:[{
                      name:{type:String},
                      email:{type:String},
                      mobileNumber:{type:String},
                      address:{type:String},
                      city:{type:String},
                      state:{type:String},
                      pincode:{type:Number},
                      landmark:{type:String},
                      alternativeMobileNumber:{type:String},
                      locality:{type:String},
                    useMyCurretAddress:{type:Boolean},}],
                    
                    paymentResult: [{
                        auth_id: { type: String, default: null },
                        authorization: { type: String, default: null },
                        bank_reference: { type: String },
                        cf_payment_id: { type: String },
                        entity: { type: String },
                        error_details: { type: mongoose.Schema.Types.Mixed },
                        is_captured: { type: Boolean },
                        order_amount: { type: Number },
                        order_id: { type: String },
                        payment_amount: { type: Number },
                        payment_completion_time: { type: String },
                        payment_currency: { type: String },
                        payment_gateway_details: { type: mongoose.Schema.Types.Mixed },
                        payment_group: { type: String },
                        payment_message: { type: String },
                        payment_method: {
                            upi: {
                                channel: { type: String },
                                upi_id: { type: String }
                            }
                        },
                        payment_offers: { type: mongoose.Schema.Types.Mixed },
                        payment_status: { type: String },
                        payment_time: { type: String }
                    }],                
    paymentMethod:{type:String},
    paymentOption:[{
                    paytm:{type:String},
                    upi:{type:String},
                    cardNumber:{type:String},
                    expiryDate:{type:String},
                    cvv:{type:String},
                    nameOnCard:{type:String},
                    otp:{type:String},
                    status:{type:String},
                    cashOnDelivery:{type:String}
    }],
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },  
    createdOn: { type: Date },
    createdBy: { type: String }
 
})
 
export const Order = mongoose.model("Order", orderSchema);

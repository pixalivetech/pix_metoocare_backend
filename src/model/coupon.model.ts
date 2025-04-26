import mongoose from "mongoose";


export interface CouponDocument extends mongoose.Document {
    _id?: any;
    companyId?: any;
    productId?: any;
    discountedPrice?: number;
    userId?: any;
    code?: string;
    usedBy?: any[];
    isUsed?: boolean;
    validFrom?: Date;
    validTill?: Date;
   isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string
}

export const couponSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    companyId: { type:mongoose.Schema.Types.ObjectId, ref: 'Company'},
    userId: { type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    productId:[ { type:mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    discountedPrice: { type: Number },
    code: { type: String },
    // usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    validFrom: { type: Date },
    validTill: { type:Date  },
    usedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
    isUsed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
})

export const Coupon = mongoose.model('Coupon', couponSchema)

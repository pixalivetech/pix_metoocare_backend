import { Document, Schema, model, Types } from 'mongoose';
import mongoose from 'mongoose';

export interface FaqDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  doctorId: Types.ObjectId[];
  question?: string;
  answer?: string;
  hisPaid?: boolean;
  isDeleted?: boolean;
  status?: number;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}

const faqSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  doctorId: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
  question: { type: String },
  answer: { type: String },
  hisPaid: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  status: { type: Number, default: 1 },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
});
export const Faq = mongoose.model('Faq',faqSchema);
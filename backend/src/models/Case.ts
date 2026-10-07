import mongoose, { InferSchemaType } from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    type: { type: String, required: true, trim: true, maxlength: 100 },
    status: { type: String, required: true, trim: true, maxlength: 100 },
    deadline: { type: String, trim: true, maxlength: 100 },
    clientName: { type: String, required: true, trim: true, maxlength: 200 },
    // A client account registered with this email can open the case.
    clientEmail: { type: String, trim: true, lowercase: true, maxlength: 320, default: '', index: true },
    description: { type: String, default: '', maxlength: 10000 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, minimize: false }
);

caseSchema.index({ ownerId: 1, updatedAt: -1 });
caseSchema.index({ memberIds: 1, updatedAt: -1 });

export type CaseDocument = InferSchemaType<typeof caseSchema> & { _id: mongoose.Types.ObjectId };
export const CaseModel = mongoose.model('Case', caseSchema);

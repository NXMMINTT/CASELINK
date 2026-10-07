import mongoose, { InferSchemaType } from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true, trim: true, maxlength: 200 },
    role: { type: String, enum: ['lawyer', 'client'], required: true },
    text: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true }
);

messageSchema.index({ caseId: 1, createdAt: 1 });

export type MessageDocument = InferSchemaType<typeof messageSchema> & { _id: mongoose.Types.ObjectId };
export const MessageModel = mongoose.model('Message', messageSchema);

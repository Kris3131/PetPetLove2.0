import mongoose from 'mongoose';

export interface IBlock extends mongoose.Document {
  blocker: mongoose.Types.ObjectId;
  blocked: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BlockSchema = new mongoose.Schema<IBlock>(
  {
    blocker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Block = mongoose.model<IBlock>('Block', BlockSchema, 'blocks');
export default Block;

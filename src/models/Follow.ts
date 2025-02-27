import mongoose from 'mongoose';

export interface IFollow extends mongoose.Document {
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FollowSchema = new mongoose.Schema<IFollow>(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, collection: 'follows' }
);

const Follow = mongoose.model<IFollow>('Follow', FollowSchema, 'follows');
export default Follow;

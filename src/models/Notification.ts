import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  receiver: mongoose.Types.ObjectId;
  initiator: mongoose.Types.ObjectId;
  type: 'follow' | 'like' | 'comment';
  relatedId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: { type: String, enum: ['follow', 'like', 'comment'], required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'type' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  'Notification',
  NotificationSchema,
  'notifications'
);
export default Notification;

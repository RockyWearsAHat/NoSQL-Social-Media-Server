import { Schema, model, Document, ObjectId, Types } from "mongoose";

export interface IReaction extends Document {
  reactionId: ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date | string;
}

const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Types.ObjectId,
      required: true,
      default: new Types.ObjectId(),
      primaryKey: true,
    },
    reactionBody: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: (createdAt: Date) => createdAt.toLocaleDateString(),
    },
  },
  {
    id: false,
    toJSON: {
      getters: true,
      transform: (doc, ret) => {
        ret.reactionId = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

// Create the reaction model
const Reaction = model<IReaction>("Reaction", reactionSchema);

export default Reaction;

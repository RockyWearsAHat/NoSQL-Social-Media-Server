import mongoose, { Schema, Document, ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { validateEmail } from "../../helpers/validateEmail";
import Thought, { IThought } from "./thoughts";
import { IReaction } from "./reactions";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  thoughts: ObjectId[];
  friends: ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
  toJSON: () => Partial<IUser>;
  populateFriends: () => Promise<IUser>;
  populateThoughts: () => Promise<IUser>;
  friendCount: () => number;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thought",
      default: [],
      required: true,
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
      required: true,
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function (): Partial<IUser> {
  let userObject = this.toObject();
  //Remove unnecessary data
  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.methods.populateFriends = async function (): Promise<IUser> {
  return await this.populate("friends", "_id username");
};

userSchema.methods.populateThoughts = async function (): Promise<IUser> {
  const thoughtsPopulated = await this.populate({
    path: "thoughts",
    select: "_id thoughtText createdAt reactions",
    transform: (doc: IThought) => {
      if (doc !== null) {
        return doc.toJSON();
      }
    },
  });

  const thoughtsAndReactionsPopulated = await thoughtsPopulated.populate({
    path: "thoughts.reactions",
    select: "-__v",
    transform: (doc: IReaction) => {
      if (doc !== null) {
        return doc.toJSON();
      }
    },
  });

  return thoughtsAndReactionsPopulated;
};

// This syntax is interesting, I don't like the User.get("friendCount") I'd rather have a function
// to call on the user that returns friend count, just personal preference ig?
// userSchema.virtual("friendCount").get(function (this: IUser) {
//   return this.thoughts.length;
// });

userSchema.methods.friendCount = function (): number {
  return this.friends.length;
};

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const user = await User.findOne({ username: this.username });
    if (!user) return next();

    user.thoughts.forEach(async (thought) => {
      await Thought.findByIdAndDelete(thought);
    });

    await user.save();

    return next();
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

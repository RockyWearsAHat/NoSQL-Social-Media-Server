import mongoose, { Schema, model } from 'mongoose';

const thoughtSchema = new Schema({
    thoughtText: {
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
        get: (createdAt) => createdAt.toLocaleDateString(),
    },
    reactions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reaction",
            default: [],
            required: true,
        },
    ],
}, {
    //Stop JSON from returning _id and id
    id: false,
    toJSON: { getters: true },
});
thoughtSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const user = await mongoose
        .model("User")
        .findOne({ username: this.username });
    if (!user)
        return next();
    for (let i = 0; i < user.thoughts.length; i++) {
        if ((await Thought.findById(user.thoughts[i])) === null) {
            user.thoughts.splice(i, 1);
        }
    }
    await user.save();
    await mongoose
        .model("User")
        .findOneAndUpdate({ username: this.username }, { $pull: { thoughts: this._id } }, { returnDocument: "after" });
    return next();
});
const Thought = model("Thought", thoughtSchema);

export { Thought as default };
//# sourceMappingURL=thoughts.js.map

import { Schema, Types, model } from 'mongoose';

const reactionSchema = new Schema({
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
        get: (createdAt) => createdAt.toLocaleDateString(),
    },
}, {
    id: false,
    toJSON: {
        getters: true,
        transform: (doc, ret) => {
            ret.reactionId = doc._id;
            delete ret._id;
            return ret;
        },
    },
});
// Create the reaction model
const Reaction = model("Reaction", reactionSchema);

export { Reaction as default };
//# sourceMappingURL=reactions.js.map

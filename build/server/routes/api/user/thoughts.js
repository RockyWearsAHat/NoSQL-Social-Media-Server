import { Router } from 'express';
import Thought from '../../../../db/models/thoughts.js';
import { Types } from 'mongoose';
import { withAuth } from '../authMiddleware.js';
import User from '../../../../db/models/user.js';
import Reaction from '../../../../db/models/reactions.js';

const router = Router();
router.get("/getAll", async (_req, res) => {
    const allThoughts = await Thought.find()
        .select("-__v")
        .populate("reactions", "-__v");
    return res.json({
        success: true,
        message: "All thoughts retrieved",
        thoughts: allThoughts,
    });
});
router.get("/:id", async (req, res) => {
    if (Types.ObjectId.isValid(req.params.id) !== true) {
        return res.json({
            success: false,
            message: "Invalid thought id",
        });
    }
    const thought = await Thought.findById(req.params.id).populate("reactions", "-__v");
    if (!thought) {
        return res.json({
            success: false,
            message: "Thought not found",
        });
    }
    return res.json({
        success: true,
        message: "Thought retrieved",
        thought: thought.toJSON(),
    });
});
router.post("/", withAuth, async (req, res) => {
    const { thoughtText } = req.body;
    if (!thoughtText) {
        return res.json({
            success: false,
            message: "thoughtText for post is required",
        });
    }
    const newThought = await Thought.create({
        thoughtText,
        username: req.session.user.username,
    });
    const updatedUser = await User.findOneAndUpdate({ _id: req.session.user._id }, { $push: { thoughts: newThought._id } }, { returnDocument: "after", getters: true });
    if (!updatedUser) {
        return res.json({
            success: false,
            message: "Unable to update user, please try again",
        });
    }
    req.session.user = updatedUser;
    const userWithFriends = await updatedUser.populateFriends();
    const userWithFriendsAndThoughts = await userWithFriends.populateThoughts();
    return res.json({
        success: true,
        message: "Thought created",
        thought: userWithFriendsAndThoughts,
    });
});
router.delete("/:id", withAuth, async (req, res) => {
    if (Types.ObjectId.isValid(req.params.id) !== true) {
        return res.json({
            success: false,
            message: "Invalid thought id",
        });
    }
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
        return res.json({
            success: false,
            message: "Thought not found",
        });
    }
    if (thought.username !== req.session.user.username) {
        return res.json({
            success: false,
            message: "You can only delete your own thoughts",
        });
    }
    await thought.deleteOne();
    const updatedUser = await User.findOneAndUpdate({ _id: req.session.user._id }, { $pull: { thoughts: thought._id } }, { returnDocument: "after", getters: true });
    if (!updatedUser) {
        return res.json({
            success: false,
            message: "Unable to update user, please try again",
        });
    }
    req.session.user = updatedUser;
    const userWithFriends = await updatedUser.populateFriends();
    const userWithFriendsAndThoughts = await userWithFriends.populateThoughts();
    return res.json({
        success: true,
        message: "Thought deleted",
        thought: userWithFriendsAndThoughts,
    });
});
router.put("/:id", withAuth, async (req, res) => {
    if (Types.ObjectId.isValid(req.params.id) !== true) {
        return res.json({
            success: false,
            message: "Invalid thought id",
        });
    }
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
        return res.json({
            success: false,
            message: "Thought not found",
        });
    }
    if (thought.username !== req.session.user.username) {
        return res.json({
            success: false,
            message: "You can only update your own thoughts",
        });
    }
    const { thoughtText, createdAt } = req.body;
    if (!thoughtText && !createdAt) {
        return res.json({
            success: false,
            message: "thoughtText or createdAt required for updating",
        });
    }
    if (createdAt && isNaN(Date.parse(createdAt))) {
        return res.json({
            success: false,
            message: "Invalid createdAt date",
        });
    }
    let updatedFields = {};
    thoughtText ? (updatedFields.thoughtText = thoughtText) : null;
    createdAt ? (updatedFields.createdAt = createdAt) : null;
    await thought.updateOne(updatedFields);
    const userNewData = await User.findById(req.session.user._id);
    if (!userNewData) {
        return res.json({
            success: false,
            message: "Unable to get new user info",
        });
    }
    req.session.user = userNewData;
    const userWithFriends = await userNewData.populateFriends();
    const userWithFriendsAndThoughts = await userWithFriends.populateThoughts();
    return res.json({
        success: true,
        message: "Thought updated",
        user: userWithFriendsAndThoughts.toJSON(),
    });
});
router.post("/:id/reaction", withAuth, async (req, res) => {
    if (Types.ObjectId.isValid(req.params.id) !== true) {
        return res.json({
            success: false,
            message: "Invalid thought id",
        });
    }
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
        return res.json({
            success: false,
            message: "Thought not found",
        });
    }
    const { reactionBody } = req.body;
    const { _id: userId, username } = req.session.user;
    if (!reactionBody) {
        return res.json({
            success: false,
            message: "reactionBody required for reaction post",
        });
    }
    const { _id: reactionId } = await Reaction.create({
        reactionBody,
        username,
    });
    thought.reactions.push(reactionId);
    await thought.save();
    const updatedThought = await Thought.findById(req.params.id);
    if (!updatedThought) {
        return res.json({
            success: false,
            message: "Unable to get thought after updating reactions",
        });
    }
    const thoughtWithReactions = await updatedThought.populate("reactions", "-__v");
    return res.json({
        success: true,
        message: "Reaction added",
        thought: thoughtWithReactions.toJSON(),
    });
});
router.delete("/:id/reaction", withAuth, async (req, res) => {
    const { reactionId } = req.body;
    if (!reactionId) {
        return res.json({
            success: false,
            message: "reactionId required for reaction deletion",
        });
    }
    if (Types.ObjectId.isValid(reactionId) !== true) {
        return res.json({
            success: false,
            message: "Invalid reactionId",
        });
    }
    const thought = await Thought.findById(req.params.id);
    if (thought?.reactions.includes(reactionId) !== true) {
        return res.json({
            success: false,
            message: "Reaction not found on thought",
        });
    }
    await Reaction.findByIdAndDelete(reactionId);
    thought.reactions = thought.reactions.filter((reaction) => reaction !== reactionId);
    let currentReactions = [];
    for (let i = 0; i < thought.reactions.length; i++) {
        const reactionId = thought.reactions[i];
        const reaction = await Reaction.findById(reactionId);
        if (reaction) {
            currentReactions.push(reactionId);
        }
    }
    thought.reactions = currentReactions;
    await thought.save();
    res.json({
        success: true,
        message: "Reaction deleted",
        thought: (await thought.populate("reactions", "-__v")).toJSON(),
    });
});

export { router as default };
//# sourceMappingURL=thoughts.js.map

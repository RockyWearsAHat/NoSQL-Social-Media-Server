import { Router } from 'express';
import { Types } from 'mongoose';
import User from '../../../../db/models/user.js';
import { withAuth } from '../authMiddleware.js';

const { ObjectId } = Types;
const router = Router();
router.get("/", withAuth, async (req, res) => {
    //Get the logged in user and validate that the user exists
    const user = await User.findOne({ _id: req.session.user._id });
    if (!user) {
        return res.json({
            success: false,
            message: "Logged in user not found?",
        });
    }
    //Populate the friends of the user
    const userWithFriends = await user.populateFriends();
    const jsonUser = userWithFriends.toJSON();
    //Update the session data of the logged in user
    req.session.user = jsonUser;
    req.session.save();
    return res.json({
        success: true,
        message: "Friends retrieved",
        user: jsonUser,
    });
});
router.get("/:id", withAuth, async (req, res) => {
    //Get the user by the id in the url
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        return res.json({
            success: false,
            message: "User not found",
        });
    }
    //Populate the friends of the user
    const userWithFriends = await user.populateFriends();
    const jsonUser = userWithFriends.toJSON();
    return res.json({
        success: true,
        message: "Friends retrieved",
        user: jsonUser,
    });
});
router.post("/", withAuth, async (req, res) => {
    const { username, uid } = req.body;
    //Verify uid is valid
    if (uid && !ObjectId.isValid(uid)) {
        return res.json({ success: false, message: "Invalid uid" });
    }
    //Make sure request came with either a username or a uid
    if (!username && !uid)
        return res.json({
            success: false,
            message: "Username or uid required",
        });
    //Find a user by either username or id and validate that the user exists
    const foundUser = (await User.findOne({ username })) || (await User.findOne({ _id: uid }));
    if (!foundUser) {
        return res.json({
            success: false,
            message: "User not found",
        });
    }
    //Ensure the user is adding a different person as a friend
    if (foundUser._id === req.session.user._id) {
        return res.json({
            success: false,
            message: "You can't add yourself as a friend",
        });
    }
    //Get the logged in user and validate that the user exists, req.session.user is defined in withAuth I don't love !
    //but no other way to my knowledge to say this is defined in the previous function?
    const user = await User.findOne({ _id: req.session.user._id });
    if (!user) {
        return res.json({
            success: false,
            message: "Logged in user not found?",
        });
    }
    //If the logged in user already has the user as a friend
    if (user.friends.includes(foundUser._id)) {
        return res.json({
            success: false,
            message: `User ${foundUser.username} is already a friend of ${user.username}`,
        });
    }
    //Otherwise add user as a friend
    else {
        //This will be defined, but has to be marked as IUser | null otherwise type errors
        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, {
            $push: { friends: foundUser._id },
        }, { returnDocument: "after" });
        //Validate, just in case, should never hit this (to my knowledge?)
        if (!updatedUser)
            return res.json({
                success: false,
                message: "Somehow, error adding friend",
            });
        //Remove password from user
        const userWithFriends = await updatedUser.populateFriends();
        const jsonUser = userWithFriends.toJSON();
        //Update the session data of the logged in user
        req.session.user = jsonUser;
        req.session.save();
        return res.json({
            success: true,
            message: "User added as friend",
            user: jsonUser,
        });
    }
});
router.delete("/", withAuth, async (req, res) => {
    //Basically the same as above, just some slight modifications in the logic
    const { username, uid } = req.body;
    if (uid && !ObjectId.isValid(uid)) {
        return res.json({ success: false, message: "Invalid uid" });
    }
    if (!username && !uid)
        return res.json({
            success: false,
            message: "Username or uid required",
        });
    const foundUser = (await User.findOne({ username })) || (await User.findOne({ _id: uid }));
    if (!foundUser) {
        return res.json({
            success: false,
            message: "User not found",
        });
    }
    const user = await User.findOne({ _id: req.session.user._id });
    if (!user) {
        return res.json({
            success: false,
            message: "Logged in user not found?",
        });
    }
    if (!user.friends.includes(foundUser._id)) {
        return res.json({
            success: false,
            message: `User ${foundUser.username} is not a friend of ${user.username}`,
        });
    }
    else {
        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, {
            $pull: { friends: foundUser._id },
        }, { returnDocument: "after" });
        if (!updatedUser)
            return res.json({
                success: false,
                message: "Somehow, error deleting friend",
            });
        const userWithFriends = await updatedUser.populateFriends();
        const jsonUser = userWithFriends.toJSON();
        req.session.user = jsonUser;
        req.session.save;
        return res.json({
            success: true,
            message: "User removed as friend",
            user: jsonUser,
        });
    }
});

export { router as default };
//# sourceMappingURL=friends.js.map

import { Router } from 'express';
import User from '../../../../db/models/user.js';

const router = Router();
router.put("/", async (req, res) => {
    const { username, password, email, } = req.body;
    if (!username && !password && !email) {
        return res.json({
            success: false,
            message: "Username, password, or email required to update user",
        });
    }
    const userExistsWithUsername = await User.exists({ username });
    if (userExistsWithUsername) {
        let message = username == req.session.user?.username
            ? `${username} is your current username`
            : "Username already exists";
        return res.json({
            success: false,
            message,
        });
    }
    const userExistsWithEmail = await User.exists({ email });
    if (userExistsWithEmail) {
        let message = email == req.session.user?.email
            ? `${email} is your current email`
            : "Email already exists";
        return res.json({
            success: false,
            message,
        });
    }
    const userid = req.session.user?._id;
    if (!userid) {
        return res.json({
            success: false,
            message: "User not logged in",
        });
    }
    //Find user to update
    const foundUser = await User.findById(userid);
    if (!foundUser) {
        return res.json({
            success: false,
            message: "User not found",
        });
    }
    //Create the object to update the user
    let setQuery = {};
    username ? (setQuery.username = username) : null;
    password ? (setQuery.password = password) : null;
    email ? (setQuery.email = email) : null;
    //Update the user
    const updatedUser = await foundUser.set(setQuery).save();
    if (!updatedUser) {
        return res.json({
            success: false,
            message: "User unable to be updated",
        });
    }
    //Readd Friends
    const userWithFriends = await updatedUser.populateFriends();
    const userWithFriendsAndThoughts = await userWithFriends.populateThoughts();
    //Get JSON (No pass)
    const jsonUser = userWithFriendsAndThoughts.toJSON();
    req.session.user = jsonUser;
    return res.json({
        success: true,
        message: "User updated",
        user: jsonUser,
    });
});
router.get("/getAll", async (req, res) => {
    const allUsers = await User.find();
    let allUsersWithFriends = await Promise.all(allUsers.map(async (user) => {
        const userWithFriends = await user.populateFriends();
        const userWithFriendsAndThoughts = await userWithFriends.populateThoughts();
        return userWithFriendsAndThoughts;
    }));
    let jsonAllUsers = allUsersWithFriends.map((user) => {
        return user.toJSON();
    });
    return res.json({
        success: true,
        message: "All users retrieved",
        users: jsonAllUsers,
    });
});
router.get("/:id?", async (req, res) => {
    const user = await User.findById(req.params.id || req.session.user?._id);
    if (!user) {
        return res.json({
            success: false,
            message: "User not found",
        });
    }
    const userWithFriends = await user.populateFriends();
    const userWithFriendsAndThoughts = await userWithFriends.populateThoughts();
    const jsonUser = userWithFriendsAndThoughts.toJSON();
    return res.json({
        success: true,
        message: "User retrieved",
        user: jsonUser,
    });
});
router.delete("/", async (req, res) => {
    const userid = req.session.user?._id;
    if (!userid) {
        return res.json({
            success: false,
            message: "User not logged in",
        });
    }
    const foundUser = await User.findById(userid);
    if (!foundUser) {
        return res.json({
            success: false,
            message: "User not found",
        });
    }
    const deletedUser = await foundUser.deleteOne();
    if (!deletedUser) {
        return res.json({
            success: false,
            message: "User unable to be deleted? Please try again",
        });
    }
    return res.json({
        success: true,
        message: "User & all associated data deleted",
    });
});

export { router as default };
//# sourceMappingURL=users.js.map

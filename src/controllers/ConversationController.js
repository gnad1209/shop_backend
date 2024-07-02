const Converstation = require("../models/ConversationModel");
const Users = require("../models/UserModel");

const createConversation = async (req, res) => {
    try {
        const { senderId, reciverId } = req.body;

        const newConversation = new Converstation({ members: [senderId, reciverId] });
        await newConversation.save();
        res.status(200).send("Conversation created succesfully")

    } catch (error) {
        console.log("Error", error);

    }
}

const getMember = async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Converstation.find({ members: { $in: [userId] } });

        const conversationUserData = Promise.all(conversations.map(async (converstation) => {
            const reciverId = converstation.members.find((member) => member !== userId);
            const user = reciverId ? await Users.findById(reciverId) : null
            return { user: { reciverId: user._id, email: user?.email, name: user?.name, avatar: user?.avatar }, conversationId: converstation._id }

        }))
        res.status(200).json(await conversationUserData);
    } catch (error) {
        console.log("error", error);

    }
}

module.exports = { createConversation, getMember }
const Conversation = require("../models/ConversationModel");
const Messages = require("../models/MessagesModel");
const Users = require("../models/UserModel");

const sendMess = async (req, res) => {
  try {
    body = { ...req.body };
    const { conversationId, senderId, message, reciverId = "" } = body;
    if (!senderId || !message)
      return res.status(400).send("Please fill all required fields");
    if (conversationId == "new" && reciverId) {
      const newConversation = new Conversation({
        members: [senderId, reciverId],
      });
      await newConversation.save();
      const newMessage = new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).send("Message sent succesfuly");
    } else if (!conversationId || reciverId == "") {
      return res.status(400).send("please fill all required fields");
    }

    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent succesfuly");
  } catch (error) {
    console.log("error", error);
  }
};

const getMess = async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      const messages = await Messages.find({ conversationId });
      const messagesUserData = Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);

          return {
            user: { id: user._id, email: user.email, name: user.name },
            message: message.message,
          };
        })
      );

      res.status(200).json(await messagesUserData);
    };

    const conversationId = req.params.conversationId;

    if (conversationId == "new") {
      const checkConversation = await Conversation.find({
        members: { $all: [req.query.senderId, req.query.reciverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  sendMess,
  getMess,
};

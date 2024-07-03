const express = require("express");
const dotenv = require('dotenv')
const mongoose = require("mongoose");
// const db = require('./config/db');
const routes = require('./routes');
const bodyParser = require("body-parser");
const cors = require('cors')
const cookieParser = require("cookie-parser")
const http = require("http")
const socketIo = require('socket.io');;
const Users = require('./models/UserModel')
dotenv.config()

const port = process.env.PORT || 9000

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://shop-gold-eight.vercel.app",
        // methods: ["GET", "POST"],
        // credentials: true
    }
});

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cookieParser())

routes(app)


let users = [];

io.on("connection", socket => {

    socket.on("addUser", userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit("getUsers", users);
        }
    });

    socket.on("sendMessage", async ({ senderId, reciverId, message, conversationId }) => {
        const reciver = users.find(user => user.userId === reciverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);

        if (reciver) {
            io.to(reciver.socketId).to(sender.socketId).emit("getMessage", {
                senderId,
                message,
                conversationId,
                reciverId,
                user: { id: user._id, name: user.name, email: user.email }
            });
        }
        else {
            io.to(sender.socketId).emit("getMessage", {
                senderId,
                message,
                conversationId,
                reciverId,
                user: { id: user._id, name: user.name, email: user.email }
            });
        }
    });


    socket.on("disconnect", () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit("getUsers", users);
    });

})

mongoose.connect(`${process.env.MONGO_db}`)
    .then(() => {
        console.log('Connected db success');
    })
    .catch((err) => {
        console.log(err);
    })


server.listen(port, () => {
    console.log(`server is running with port: ${port}`)
})

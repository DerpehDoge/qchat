const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.use(express.static("../client/dist"));

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

server.listen(3001, () => {
	console.log("Server is running on port 3001");
});

let onlineUsers = new Map();

io.on("connect", (socket) => {
	onlineUsers.set(socket.id, {
		name: "setting name...",
		image: "",
	});
	console.log(onlineUsers);
	socket.on("requestOnlineUsers", () => {
		io.emit("onlineUsers", Object.fromEntries(onlineUsers));
	});
	socket.on("userUpdate", (user) => {
		onlineUsers.set(socket.id, user);
		io.emit("onlineUsers", Object.fromEntries(onlineUsers));
	});
	socket.on("disconnect", () => {
		onlineUsers.delete(socket.id);
		console.log("Client disconnected");
		io.emit("onlineUsers", Object.fromEntries(onlineUsers));
	});
	socket.on("message", (msg) => {
		console.log(msg);
		socket.broadcast.emit("message", msg);
	});
});

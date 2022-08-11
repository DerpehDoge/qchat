const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

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

io.on("connect", (socket) => {
	console.log("New client connected");
	socket.on("message", (msg) => {
		console.log(msg);
		socket.broadcast.emit("message", msg);
	});
});

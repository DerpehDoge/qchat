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

io.on("connect", (socket) => {
	socket.on("requestRoomSize", () => {
		socket.emit("roomSize", io.engine.clientsCount);
		io.emit("roomSize", io.engine.clientsCount);
	});
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		io.emit("roomSize", io.engine.clientsCount);
	});
	socket.on("message", (msg) => {
		console.log(msg);
		socket.broadcast.emit("message", msg);
	});
});

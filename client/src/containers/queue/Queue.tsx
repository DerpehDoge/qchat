import React, { Component, useEffect, useState } from "react";
import { Button, Modal, Timeline } from "@mantine/core";
import "./queue.css";

import io, { Socket } from "socket.io-client";
type props = {
	socket: Socket | null;
};

export default function (props: props) {
	const [roomSize, changeRoomSize] = useState(0);
	// run once to prevent multiple calls (trust me i learned this the hard way)
	useEffect(() => {
		let socket = props.socket;
		if (socket) {
			socket.emit("requestRoomSize");
		}
		socket?.on("roomSize", (size: number) => {
			changeRoomSize(size);
		});
	}, [props.socket]);

	return (
		<div>
			<h1>hey nerd there's {roomSize} people in here.</h1>
			{roomSize > 1 ? <h1>wow you're not alone. surprising.</h1> : <></>}
		</div>
	);
}

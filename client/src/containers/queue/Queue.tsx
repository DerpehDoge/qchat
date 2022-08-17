import React, { Component, useEffect, useState } from "react";
import { Avatar, Button, Modal, Timeline, Tooltip } from "@mantine/core";
import "./queue.css";

import io, { Socket } from "socket.io-client";
type props = {
	socket: Socket | null;
};

export default function (props: props) {
	const [onlineUsers, setOnlineUsers] = useState<
		Map<
			string,
			{
				name: string;
				image: string;
			}
		>
	>(new Map());
	// run once to prevent multiple calls (trust me i learned this the hard way)
	useEffect(() => {
		let socket = props.socket;
		if (socket) {
			// for initialization only (cannot use on connect because it sends too early)
			socket.emit("requestOnlineUsers");
		}
		console.log(onlineUsers);
		socket?.on(
			"onlineUsers",
			(users: {
				[id: string]: {
					name: string;
					image: string;
				};
			}) => {
				console.log(users);
				setOnlineUsers(new Map(Object.entries(users)));
			}
		);
	}, [props.socket]);

	return (
		<div>
			<h1>
				look at who you're with in this room. say hi. this is a threat.
			</h1>
			<Tooltip.Group openDelay={300} closeDelay={100}>
				<Avatar.Group spacing="xl">
					{Array.from(onlineUsers.entries()).map((entry, index) => {
						return (
							<Tooltip label={entry[1].name} withArrow>
								<Avatar
									style={
										entry[1].image.startsWith(
											"https://avatars.dicebear.com/api/identicon/"
										)
											? {
													backgroundColor: "white",
											  }
											: {}
									}
									src={entry[1].image}
									alt={entry[1].name}
									radius="xl"
									size="lg"
								>
									{entry[1].image ? "" : "?"}
								</Avatar>
							</Tooltip>
						);
					})}
				</Avatar.Group>
			</Tooltip.Group>
		</div>
	);
}

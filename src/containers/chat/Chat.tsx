import {
	Button,
	Container,
	Group,
	Modal,
	ScrollArea,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Message, { MessageProps } from "../../components/Message";
import { useEffect, useMemo, useRef, useState } from "react";
import "./chat.css";
import { getHotkeyHandler } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import moment from "moment";
import RichTextEditor from "@mantine/rte";

import { Socket } from "socket.io-client";
import { createHash } from "crypto";
type props = {
	socket: Socket | null;
};

export default function Chat(props: props) {
	const maxMessages = 250;
	const theme = useMantineTheme();
	const [value, onChange] = useState("");
	const [promptOpen, setPromptOpen] = useState(false);
	const bottomRef = useRef(null);
	useEffect(() => {
		setPromptOpen(true);
	}, []);

	const [onlineUsers, setOnlineUsers] = useState<
		Map<
			string,
			{
				name: string;
				image: string;
			}
		>
	>(new Map());

	const mentions = useMemo(
		() => ({
			allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
			mentionDenotationCharacters: ["@", "/"],
			source: (
				searchTerm: string,
				renderList: (a: { id: number; value: string }[]) => null,
				mentionChar: string
			) => {
				const list = Array.from(onlineUsers.values()).map(
					(item, index) => {
						return {
							id: index,
							value: item.name,
						};
					}
				);
				const includesSearchTerm = list.filter((item) =>
					item.value.toLowerCase().includes(searchTerm.toLowerCase())
				);
				renderList(includesSearchTerm);
			},
		}),
		[onlineUsers]
	);

	const [user, setUser] = useState({
		name: "",
		image: "",
	});
	const form = useForm({
		initialValues: {
			name: "stranger",
			image: `https://avatars.dicebear.com/api/identicon/${Math.floor(
				Math.random() * Math.pow(16, 4)
			).toString(16)}.svg`,
		},

		validate: {
			name: (value) =>
				value.length > 0
					? value.length < 4
						? "username must be at least 4 characters"
						: value.length > 24
						? "username must be less than 24 characters"
						: Array.from(onlineUsers.values())
								.map((a) => a.name)
								.includes(value)
						? "username taken. get original. nerd."
						: undefined
					: "username is required",
		},
	});

	const [messages, setMessages] = useState<Omit<MessageProps, "me">[]>([]);

	useEffect(() => {
		while (messages.length > maxMessages) {
			messages.shift();
		}
		// @ts-ignore
		bottomRef.current.scrollIntoView({
			behavior: "smooth",
			alignToTop: false,
		});
	}, [messages]);
	let messageList = useMemo(
		() =>
			messages.map((msg, index) => {
				if (msg.firstRender) {
					msg.firstRender = false;
					return (
						<Message
							postedAt={msg.postedAt}
							message={msg.message}
							author={msg.author}
							me={user}
							firstRender={true}
							key={Math.random() * 10000000000000000}
						/>
					);
				} else {
					return (
						<Message
							postedAt={msg.postedAt}
							message={msg.message}
							author={msg.author}
							me={user}
							firstRender={false}
							key={Math.random() * 10000000000000000}
						/>
					);
				}
			}),
		[messages]
	);

	let socket = props.socket;

	// run this only ONCE

	useEffect(() => {
		console.log("socket created");
		socket?.on("message", (msg) => {
			console.log(msg);
			setMessages((messages) => [...messages, msg]);
		});

		socket?.on(
			"onlineUsers",
			(users: {
				[id: string]: {
					name: string;
					image: string;
				};
			}) => {
				setOnlineUsers(new Map(Object.entries(users)));
			}
		);

		return () => {
			socket?.off("message");
		};
	}, []);

	// set textbox height
	let messagesRef = useRef(null);
	const [height, setHeight] = useState(0);
	useEffect(() => {
		//@ts-ignore
		setHeight(messagesRef.current.clientHeight);
	});

	return (
		<Stack
			justify="space-between"
			style={{
				height: "100%",
				width: "100%",
				gap: "0px",
			}}
		>
			<Modal
				opened={promptOpen}
				onClose={() => setPromptOpen(false)}
				title={"Looks like you're new here!"}
				centered
				overlayBlur={6}
				transition="slide-up"
				closeOnClickOutside={false}
				withCloseButton={false}
			>
				<Text size="sm">
					We just need you to fill out a few details to get you
					started.
				</Text>
				<br />
				<form
					onSubmit={form.onSubmit((values) => {
						setPromptOpen(false);
						setUser(values);
						socket?.emit("userUpdate", values);
						console.log(values);
					})}
				>
					<TextInput
						required
						label="username"
						placeholder="floof"
						{...form.getInputProps("name")}
					/>
					<TextInput
						required
						label="avatar URL"
						placeholder="https://cdn.discordapp.com/avatars/528337161502588929/82760972bddbabc7435666fd992c0ef6.webp?size=100"
						{...form.getInputProps("image")}
					/>

					<Group position="right" mt="md">
						<Button type="submit">Submit</Button>
					</Group>
				</form>
			</Modal>
			<ScrollArea
				// @ts-ignore
				ref={messagesRef}
				style={{
					height: "100%",
					width: "100%",
				}}
			>
				<SimpleGrid cols={1} p="md">
					{messageList}
					<div
						ref={bottomRef}
						// style={{
						// 	height: 100,
						// }}
					></div>
				</SimpleGrid>
			</ScrollArea>
			<RichTextEditor
				styles={{
					root: {
						height: 300,
						overflowY: "auto",
					},
				}}
				value={value}
				placeholder={`Press enter to send a message. shift + enter lets you use multiple lines, and use @ to use mentions.`}
				onChange={onChange}
				mentions={mentions}
				onKeyDown={getHotkeyHandler([
					[
						"enter",
						() => {
							if (value !== "<p><br></p><p><br></p>") {
								let message = {
									postedAt: moment().format("MM/DD h:mm a"),
									message: value,
									author: user,
									firstRender: true,
								};
								socket?.emit("message", message);
								console.log("emitted.");
								onChange("");
								setMessages([...messages, message]);
							} else {
								onChange("");
							}
						},
					],
				])}
			/>
			<Button
				onClick={() => {
					let message = {
						postedAt: moment().format("MM/DD h:mm a"),
						message: value,
						author: user,
						firstRender: true,
					};
					socket?.emit("message", message);
					setMessages([...messages, message]);
					onChange("");
				}}
			>
				send your message
			</Button>
		</Stack>
	);
}

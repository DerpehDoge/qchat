import {
	Button,
	Group,
	Modal,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Message, { MessageProps } from "../../components/Message";
import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { getHotkeyHandler } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import moment from "moment";
import RichTextEditor from "@mantine/rte";

import io from "socket.io-client";
const socket = io(
	"https://tomorrow-occurrence-considers-bundle.trycloudflare.com"
).connect();

export default function Chat() {
	const maxMessages = 250;
	const theme = useMantineTheme();
	const [value, onChange] = useState("");
	const [promptOpen, setPromptOpen] = useState(false);
	const bottomRef = useRef(null);
	useEffect(() => {
		setPromptOpen(true);
	}, []);

	const [user, setUser] = useState({
		name: "",
		image: "",
	});
	const form = useForm({
		initialValues: {
			name: "stranger",
			image: "https://avatars0.githubusercontent.com/u/17098281?s=460&v=4",
		},

		validate: {
			name: (value) =>
				value.length > 0
					? value.length < 4
						? "username must be at least 4 characters"
						: value.length > 24
						? "username must be less than 24 characters"
						: undefined
					: "username is required",
		},
	});

	const [messages, setMessages] = useState<MessageProps[]>([]);

	useEffect(() => {
		socket.on("message", (msg) => {
			console.log(msg);
			setMessages((messages) => [...messages, msg]);
		});

		return () => {
			socket.removeAllListeners("message");
		};
	}, [socket]);
	return (
		<Stack
			justify="space-between"
			style={{
				height: "100%",
				width: "100%",
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
				style={{
					height: "100%",
					width: "100%",
				}}
			>
				<Stack
					justify="flex-end"
					style={{
						padding: theme.spacing.sm,
						height: "100%",
					}}
				>
					{messages.map((msg, index) => (
						<Message
							postedAt={msg.postedAt}
							message={msg.message}
							author={msg.author}
							key={Math.random() * 10000000000000000}
						/>
					))}
					<div
						ref={bottomRef}
						style={{
							height: 100,
						}}
					></div>
				</Stack>
			</ScrollArea>
			<RichTextEditor
				style={{
					height: 300,
					overflowY: "scroll",
				}}
				value={value}
				placeholder={`Use ctrl+enter to send your message.`}
				onChange={onChange}
				onKeyDown={getHotkeyHandler([
					[
						"ctrl + enter",
						() => {
							showNotification({
								title: "you've sent a message! yippee!",
								message: value,
								autoClose: 3000,
								color: "teal",
								icon: <IconCheck />,
							});
							if (messages.length > maxMessages) {
								messages.shift();
							}
							let message = {
								postedAt: moment().format("MM/DD h:mm a"),
								message: value,
								author: user,
							};
							socket.emit("message", message);
							setMessages([...messages, message]);
							onChange("");
							//@ts-ignore
							bottomRef.current.scrollIntoView({
								behavior: "smooth",
								alignToTop: false,
							});
						},
					],
				])}
			/>
			<Button
				onClick={() => {
					showNotification({
						title: "you've sent a message! yippee!",
						message: value,
						autoClose: 3000,
						color: "teal",
						icon: <IconCheck />,
					});
					if (messages.length > maxMessages) {
						messages.shift();
					}
					let message = {
						postedAt: moment().format("MM/DD h:mm a"),
						message: value,
						author: user,
					};
					socket.emit("message", message);
					setMessages([...messages, message]);
					onChange("");
					//@ts-ignore
					bottomRef.current.scrollIntoView({
						behavior: "smooth",
						alignToTop: false,
					});
				}}
			>
				send because laila is mean and forced me to do this
			</Button>
		</Stack>
	);
}

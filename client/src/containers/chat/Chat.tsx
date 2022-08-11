import { ScrollArea, Stack, TextInput, useMantineTheme } from "@mantine/core";
import Message, { MessageProps } from "../../components/Message";
import { useRef, useState } from "react";
import "./chat.css";
import { getHotkeyHandler } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import moment from "moment";
import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat() {
	const theme = useMantineTheme();
	const [value, onChange] = useState("");
	const bottomRef = useRef(null);
	const [messages, setMessages] = useState<MessageProps[]>([
		{
			postedAt: "08/10 10:20 PM",
			message: "hey nerds",
			author: {
				name: "floof",
				image: "https://cdn.discordapp.com/avatars/528337161502588929/82760972bddbabc7435666fd992c0ef6.webp?size=100",
			},
		},
		{
			postedAt: "08/10 10:39 PM",
			message: "why did you ghost me",
			author: {
				name: "floof",
				image: "https://cdn.discordapp.com/avatars/528337161502588929/82760972bddbabc7435666fd992c0ef6.webp?size=100",
			},
		},
		{
			postedAt: "08/10 10:39 PM",
			message: "that's so mean 😭",
			author: {
				name: "floof",
				image: "https://cdn.discordapp.com/avatars/528337161502588929/82760972bddbabc7435666fd992c0ef6.webp?size=100",
			},
		},
		{
			postedAt: "08/10 10:20 PM",
			message: "cry about it",
			author: {
				name: "SPACEW1RE",
				image: "https://cdn.discordapp.com/avatars/581283993715081246/2a8e565aae678b48def2a7069dfac2b0.webp?size=100",
			},
		},
	]);
	return (
		<Stack
			justify="space-between"
			style={{
				height: "100%",
				width: "100%",
			}}
		>
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
							key={index}
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
			<TextInput
				value={value}
				placeholder={`Use ctrl+enter to send your message.`}
				onChange={(e) => onChange(e.target.value)}
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
							setMessages([
								...messages,
								{
									postedAt: moment().format("MM/DD h:mm a"),
									message: value,
									author: {
										name: "floof",
										image: "https://cdn.discordapp.com/avatars/528337161502588929/82760972bddbabc7435666fd992c0ef6.webp?size=100",
									},
								},
							]);
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
		</Stack>
	);
}

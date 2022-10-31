import { Chat, Embed, Queue } from "./containers";
import {
	AppShell,
	Navbar,
	useMantineTheme,
	Stack,
	AspectRatio,
	Center,
	Container,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

export default function () {
	const { height, width } = useViewportSize();
	const theme = useMantineTheme();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [connected, setConnected] = useState(false);
	let nonConnectedSocket = io(
		"https://capture-matthew-hundreds-error.trycloudflare.com/",
		{
			autoConnect: false,
		}
	);

	useEffect(() => {
		nonConnectedSocket.connect();
		nonConnectedSocket.on("connect", () => {
			setSocket(nonConnectedSocket);
			setConnected(true);
			console.log(nonConnectedSocket.id);
		});
	}, []);

	return connected ? (
		<div>
			<AppShell
				styles={{
					main: {
						background:
							theme.colorScheme === "dark"
								? theme.colors.dark[8]
								: theme.colors.gray[0],
					},
				}}
				navbar={
					<Navbar
						width={{
							base: 500,
						}}
					>
						<Container
							style={{
								height: "100%",
								width: "100%",
								padding: theme.spacing.xs,
							}}
						>
							<Center
								style={{
									backgroundColor:
										theme.colorScheme === "dark"
											? theme.colors.dark[4]
											: theme.colors.gray[0],
									height: "100%",
								}}
							>
								<Chat socket={socket}></Chat>
							</Center>
						</Container>
					</Navbar>
				}
			>
				<Stack
					justify="space-between"
					style={{
						height: "100%",
					}}
				>
					<Embed socket={socket}></Embed>

					<Center
						style={{
							height: "100%",
							background:
								theme.colorScheme === "dark"
									? theme.colors.dark[4]
									: theme.colors.gray[0],
							width: "100%",
						}}
					>
						<Queue socket={socket}></Queue>
					</Center>
				</Stack>
			</AppShell>
		</div>
	) : (
		<div>
			loading website...
			<br />
			if you still see this it looks like the socket hasn't connected yet.
			it's either a bug, something's wrong with your connection, the
			server is down (or starting), or the creator of this website has
			made a stupid mistake. if you are able to, scold the creator and
			send him the logs (located in inspect element and in the console
			tab) so that he can try (and fail) to fix the website. thanks.
		</div>
	);
}

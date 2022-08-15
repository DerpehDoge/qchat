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
	let nonConnectedSocket = io("http://localhost:3001", {
		autoConnect: false,
	});

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
		<div>Loading...</div>
	);
}

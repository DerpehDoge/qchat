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

export default function () {
	const { height, width } = useViewportSize();
	const theme = useMantineTheme();
	return (
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
								<Chat></Chat>
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
					<Embed></Embed>

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
						<Queue></Queue>
					</Center>
				</Stack>
			</AppShell>
		</div>
	);
}

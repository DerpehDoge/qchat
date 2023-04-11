import {
	Avatar,
	Group,
	Paper,
	Stack,
	useMantineTheme,
	Text,
	Badge,
} from "@mantine/core";
import { useEffect, useRef } from "react";

export interface MessageProps {
	postedAt: string;
	message: string;
	author: {
		name: string;
		image: string;
	};
	me: {
		name: string;
		image: string;
	};
	firstRender: boolean;
}

export default function Message({ postedAt, message, author }: MessageProps) {
	const theme = useMantineTheme();
	let ref = useRef(null);
	return (
		<Paper
			style={{
				padding: theme.spacing.sm,
			}}
		>
			<Stack>
				<Group>
					<Avatar src={author.image} radius="sm" size="md" />
					<Stack spacing={5}>
						<Text size="sm" weight={700}>
							{author.name}
						</Text>
						<Badge size="sm" radius="sm">
							{postedAt}
						</Badge>
					</Stack>
				</Group>
				{/* Make sure to edit the inner html to resize any images */}
				<div
					key={Math.random() * 10000000000000000}
					style={{
						margin: 0,
						padding: 0,
						overflowWrap: "break-word",
					}}
					className={"content"}
					dangerouslySetInnerHTML={{
						__html: message
							.split("<img")
							.join(`<img style="width: 100%"`),
					}}
					ref={ref}
				></div>
			</Stack>
		</Paper>
	);
}

import {
	Avatar,
	Group,
	Paper,
	Stack,
	useMantineTheme,
	Text,
	Badge,
} from "@mantine/core";
import React, { useRef } from "react";

export interface MessageProps {
	postedAt: string;
	message: string;
	author: {
		name: string;
		image: string;
	};
}

export default function Message({ postedAt, message, author }: MessageProps) {
	const theme = useMantineTheme();
	return (
		<Paper
			style={{
				padding: theme.spacing.md,
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
				<div
					style={{ margin: 0, padding: 0 }}
					className={"content"}
					dangerouslySetInnerHTML={{ __html: message }}
				></div>
			</Stack>
		</Paper>
	);
}

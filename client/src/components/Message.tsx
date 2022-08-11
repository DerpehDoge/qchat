import {
	Avatar,
	Group,
	Paper,
	Stack,
	useMantineTheme,
	Text,
	Badge,
} from "@mantine/core";
import React from "react";

export interface MessageProps {
	postedAt: string;
	message: string;
	author: {
		name: string;
		image: string;
	};
	scrollableRef?: React.RefObject<null>;
}

export default function Message({
	postedAt,
	message,
	author,
	scrollableRef,
}: MessageProps) {
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
				{message}
			</Stack>
		</Paper>
	);
}

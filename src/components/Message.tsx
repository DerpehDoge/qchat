import {
	Avatar,
	Group,
	Paper,
	Stack,
	useMantineTheme,
	Text,
	Badge,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons";
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

export default function Message({
	postedAt,
	message,
	author,
	me,
	firstRender,
}: MessageProps) {
	const theme = useMantineTheme();
	let ref = useRef(null);
	useEffect(() => {
		// @ts-ignore
		let mentions = ref.current.querySelectorAll(".mention");
		if (mentions) {
			mentions.forEach((a: any) => {
				if (a.innerText.trim() == `@${me.name}`) {
					a.classList.add("mentionedMe");
					if (firstRender) {
						showNotification({
							title: `mentioned!`,
							message: `you've been mentioned by ${author.name}!`,
							autoClose: 3000,
							color: "yellow",
							icon: <IconAlertTriangle />,
						});
					}
				}
			});
		}
	}, [ref]);
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
					style={{
						margin: 0,
						padding: 0,
						overflowWrap: "break-word",
					}}
					className={"content"}
					dangerouslySetInnerHTML={{ __html: message }}
					ref={ref}
				></div>
			</Stack>
		</Paper>
	);
}

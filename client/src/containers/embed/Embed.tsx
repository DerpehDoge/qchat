import { Component, useState, useEffect } from "react";
import "./embed.css";
import YouTube, { YouTubeEvent } from "react-youtube";
import { io, Socket } from "socket.io-client";
import { AspectRatio, useMantineTheme } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";

enum PlayerState {
	UNSTARTED = -1,
	ENDED = 0,
	PLAYING = 1,
	PAUSED = 2,
	BUFFERING = 3,
	CUED = 5,
}

type props = {
	socket: Socket | null;
};

export default function (props: props) {
	const theme = useMantineTheme();
	const { ref, width, height } = useElementSize();
	return (
		<AspectRatio
			ratio={16 / 9}
			style={{
				background:
					theme.colorScheme === "dark"
						? theme.colors.dark[4]
						: theme.colors.gray[0],
			}}
			ref={ref}
		>
			<YouTube
				opts={{
					height,
					width,
				}}
				videoId="yD2FSwTy2lw"
			/>
		</AspectRatio>
	);
}

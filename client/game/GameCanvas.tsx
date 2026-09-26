import { ARENA_WIDTH, ARENA_HEIGHT } from "./arena";
import { GameLoop } from "./gameloop";

import { createBall, launchBall } from "./ball";
import { updateBall } from "./physics";

import { handleWallCollision } from "./collisionSystem";

import { useRef, useEffect } from "react";

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const ball = createBall();
        launchBall(ball, Math.PI / 6, 500);

        const render = () => {
            ctx.fillStyle = "rgba(24, 24, 27, 0.9)";
            ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

            ctx.strokeStyle = "#f4f4f5";
            ctx.lineWidth = 8;
            ctx.strokeRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 18;
            ctx.shadowColor = "#ffffff";
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.arc(
                ball.x - ball.radius * 0.35,
                ball.y - ball.radius * 0.35,
                ball.radius * 0.38,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fill();
        };

        const gameloop = new GameLoop((deltatime) => {
            updateBall(ball, deltatime);
            handleWallCollision(ball);
            render();
        });

        gameloop.start();

        return () => {
            gameloop.stop();
        };
    }, []);

    return <canvas ref={canvasRef} width={ARENA_WIDTH} height={ARENA_HEIGHT} />;
}

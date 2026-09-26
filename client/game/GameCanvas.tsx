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
            ctx.fillStyle = "rgba(24, 24, 27, 0.35)";
            ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 1;

            for (let x = 40; x < ARENA_WIDTH; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, ARENA_HEIGHT);
                ctx.stroke();
            }

            for (let y = 40; y < ARENA_HEIGHT; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(ARENA_WIDTH, y);
                ctx.stroke();
            }

            ctx.strokeStyle = "#f4f4f5";
            ctx.lineWidth = 8;
            ctx.strokeRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius + 12, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 22;
            ctx.shadowColor = "#ffffff";
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.arc(
                ball.x - ball.radius * 0.38,
                ball.y - ball.radius * 0.38,
                ball.radius * 0.35,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
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

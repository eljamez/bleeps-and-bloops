import React, { useEffect, useRef, useState } from "react";

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
};

type Ball = {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
};

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Score
  const [score, setScore] = useState({ left: 0, right: 0 });
  // For mobile touch controls or restart
  const [running, setRunning] = useState(true);

  // Game state refs (so animation loop can always read latest state)
  const leftPaddle = useRef<Paddle>({
    x: 10,
    y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
  });
  const rightPaddle = useRef<Paddle>({
    x: GAME_WIDTH - PADDLE_WIDTH - 10,
    y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
  });
  const ball = useRef<Ball>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    radius: BALL_RADIUS,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  });

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!running) return;
      if (e.key === "w") leftPaddle.current.dy = -PADDLE_SPEED;
      if (e.key === "s") leftPaddle.current.dy = PADDLE_SPEED;
      if (e.key === "ArrowUp") rightPaddle.current.dy = -PADDLE_SPEED;
      if (e.key === "ArrowDown") rightPaddle.current.dy = PADDLE_SPEED;
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "w" || e.key === "s") leftPaddle.current.dy = 0;
      if (e.key === "ArrowUp" || e.key === "ArrowDown")
        rightPaddle.current.dy = 0;
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [running]);

  // Main game loop
  useEffect(() => {
    let animationFrame: number;

    function resetBall(toLeft: boolean) {
      ball.current.x = GAME_WIDTH / 2;
      ball.current.y = GAME_HEIGHT / 2;
      ball.current.dx = BALL_SPEED * (toLeft ? -1 : 1);
      ball.current.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    }

    function draw(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw paddles
      ctx.fillStyle = "#22d3ee"; // tailwind cyan-400
      ctx.fillRect(
        leftPaddle.current.x,
        leftPaddle.current.y,
        leftPaddle.current.width,
        leftPaddle.current.height
      );
      ctx.fillStyle = "#f472b6"; // tailwind pink-400
      ctx.fillRect(
        rightPaddle.current.x,
        rightPaddle.current.y,
        rightPaddle.current.width,
        rightPaddle.current.height
      );

      // Draw ball
      ctx.beginPath();
      ctx.arc(
        ball.current.x,
        ball.current.y,
        ball.current.radius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#fbbf24"; // tailwind yellow-400
      ctx.fill();
      ctx.closePath();

      // Draw score
      ctx.font = "32px monospace";
      ctx.fillStyle = "#64748b"; // slate-500
      ctx.fillText(`${score.left}`, GAME_WIDTH / 2 - 40, 40);
      ctx.fillText(`${score.right}`, GAME_WIDTH / 2 + 20, 40);

      // Middle dashed line
      ctx.strokeStyle = "#64748b";
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function update() {
      // Move paddles
      leftPaddle.current.y += leftPaddle.current.dy;
      rightPaddle.current.y += rightPaddle.current.dy;
      // Bound paddles
      leftPaddle.current.y = Math.max(
        0,
        Math.min(GAME_HEIGHT - leftPaddle.current.height, leftPaddle.current.y)
      );
      rightPaddle.current.y = Math.max(
        0,
        Math.min(
          GAME_HEIGHT - rightPaddle.current.height,
          rightPaddle.current.y
        )
      );

      // Move ball
      ball.current.x += ball.current.dx;
      ball.current.y += ball.current.dy;

      // Collide top/bottom
      if (
        ball.current.y - ball.current.radius < 0 ||
        ball.current.y + ball.current.radius > GAME_HEIGHT
      ) {
        ball.current.dy *= -1;
      }

      // Collide left paddle
      if (
        ball.current.x - ball.current.radius <
          leftPaddle.current.x + leftPaddle.current.width &&
        ball.current.y > leftPaddle.current.y &&
        ball.current.y < leftPaddle.current.y + leftPaddle.current.height
      ) {
        ball.current.dx *= -1;
        // Add some "spin"
        ball.current.dy += leftPaddle.current.dy * 0.2;
      }

      // Collide right paddle
      if (
        ball.current.x + ball.current.radius > rightPaddle.current.x &&
        ball.current.y > rightPaddle.current.y &&
        ball.current.y < rightPaddle.current.y + rightPaddle.current.height
      ) {
        ball.current.dx *= -1;
        ball.current.dy += rightPaddle.current.dy * 0.2;
      }

      // Score left/right
      if (ball.current.x < 0) {
        setScore((s) => ({ ...s, right: s.right + 1 }));
        resetBall(false);
      }
      if (ball.current.x > GAME_WIDTH) {
        setScore((s) => ({ ...s, left: s.left + 1 }));
        resetBall(true);
      }
    }

    function gameLoop() {
      if (!running) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      update();
      draw(ctx);
      animationFrame = requestAnimationFrame(gameLoop);
    }

    animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line
  }, [running, score.left, score.right]);

  // Restart button
  function handleRestart() {
    setScore({ left: 0, right: 0 });
    leftPaddle.current.y = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    rightPaddle.current.y = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    ball.current.x = GAME_WIDTH / 2;
    ball.current.y = GAME_HEIGHT / 2;
    ball.current.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.current.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    setRunning(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-200 to-pink-100">
      <h1 className="text-3xl font-bold mb-4 text-cyan-700">Pong Game</h1>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="rounded shadow-lg border border-cyan-400 bg-white"
        tabIndex={0}
      />
      <div className="mt-6 flex items-center gap-4">
        <button
          className="px-6 py-2 bg-cyan-400 text-white font-semibold rounded hover:bg-cyan-500 transition"
          onClick={handleRestart}
        >
          Restart
        </button>
        <span className="text-slate-600 text-lg">
          Controls: W/S (Left paddle), ↑/↓ (Right paddle)
        </span>
      </div>
    </div>
  );
};

export default PongGame;

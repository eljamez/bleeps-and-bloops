"use client";

import { useMemo } from "react";
import PongGame from "./pong/page";

export default function GameContainer({ game }: { game: string }) {
  const gameComponent = useMemo(() => {
    switch (game) {
      case "pong":
        return <PongGame />;
      default:
        return null;
    }
  }, [game]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-200 to-pink-100">
      {gameComponent}
    </div>
  );
}

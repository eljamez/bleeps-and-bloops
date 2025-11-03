import type { ChessSquare } from "./chessboard";
import { InitialChessBoard } from "./chessboard";
import clsx from "clsx";

export default function ChessLocator() {
  return (
    <div>
      <h1>Chess Locator</h1>
      <p>Locate the chess pieces on the board</p>
      <div className="grid grid-cols-8 grid-rows-8">
        {InitialChessBoard.map((square: ChessSquare, index: number) => (
          <div key={index} className={clsx(square.squareColor === "black" ? 'bg-gray-900' : 'bg-white', `border border-white p-4`)}>
            {square.square}
          </div>
        ))}
      </div>
    </div >
  );
}

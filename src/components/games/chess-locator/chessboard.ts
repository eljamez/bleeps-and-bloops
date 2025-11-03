/**
 * @fileoverview Defines the data structure for a standard chessboard setup.
 * This can be used as the initial state for a chess game application.
 */

// A type representing the possible chess pieces using standard algebraic notation.
export type Piece = "P" | "R" | "N" | "B" | "Q" | "K";

// A type for the color of the pieces and the board squares.
export type Color = "white" | "black";

/**
 * An interface describing a single square on the chessboard.
 */
export interface ChessSquare {
  /**
   * The algebraic notation for the square's position (e.g., "A1", "H8").
   */
  square: string;

  /**
   * The piece currently on the square, or null if it's empty.
   */
  piece: Piece | null;

  /**
   * The color of the piece on the square, or null if it's empty.
   */
  color: Color | null;

  /**
   * The color of the square itself ("white" or "black").
   */
  squareColor: Color;
}

/**
 * An array of ChessSquare objects representing the initial state of a chessboard.
 * The array is ordered from A8 down to A1, then B8 to B1, and so on.
 */
export const InitialChessBoard: ChessSquare[] = [
  // Column A
  { square: "A8", piece: "R", color: "black", squareColor: "white" },
  { square: "A7", piece: "P", color: "black", squareColor: "black" },
  { square: "A6", piece: null, color: null, squareColor: "white" },
  { square: "A5", piece: null, color: null, squareColor: "black" },
  { square: "A4", piece: null, color: null, squareColor: "white" },
  { square: "A3", piece: null, color: null, squareColor: "black" },
  { square: "A2", piece: "P", color: "white", squareColor: "white" },
  { square: "A1", piece: "R", color: "white", squareColor: "black" },
  // Column B
  { square: "B8", piece: "N", color: "black", squareColor: "black" },
  { square: "B7", piece: "P", color: "black", squareColor: "white" },
  { square: "B6", piece: null, color: null, squareColor: "black" },
  { square: "B5", piece: null, color: null, squareColor: "white" },
  { square: "B4", piece: null, color: null, squareColor: "black" },
  { square: "B3", piece: null, color: null, squareColor: "white" },
  { square: "B2", piece: "P", color: "white", squareColor: "black" },
  { square: "B1", piece: "N", color: "white", squareColor: "white" },
  // Column C
  { square: "C8", piece: "B", color: "black", squareColor: "white" },
  { square: "C7", piece: "P", color: "black", squareColor: "black" },
  { square: "C6", piece: null, color: null, squareColor: "white" },
  { square: "C5", piece: null, color: null, squareColor: "black" },
  { square: "C4", piece: null, color: null, squareColor: "white" },
  { square: "C3", piece: null, color: null, squareColor: "black" },
  { square: "C2", piece: "P", color: "white", squareColor: "white" },
  { square: "C1", piece: "B", color: "white", squareColor: "black" },
  // Column D
  { square: "D8", piece: "Q", color: "black", squareColor: "black" },
  { square: "D7", piece: "P", color: "black", squareColor: "white" },
  { square: "D6", piece: null, color: null, squareColor: "black" },
  { square: "D5", piece: null, color: null, squareColor: "white" },
  { square: "D4", piece: null, color: null, squareColor: "black" },
  { square: "D3", piece: null, color: null, squareColor: "white" },
  { square: "D2", piece: "P", color: "white", squareColor: "black" },
  { square: "D1", piece: "Q", color: "white", squareColor: "white" },
  // Column E
  { square: "E8", piece: "K", color: "black", squareColor: "white" },
  { square: "E7", piece: "P", color: "black", squareColor: "black" },
  { square: "E6", piece: null, color: null, squareColor: "white" },
  { square: "E5", piece: null, color: null, squareColor: "black" },
  { square: "E4", piece: null, color: null, squareColor: "white" },
  { square: "E3", piece: null, color: null, squareColor: "black" },
  { square: "E2", piece: "P", color: "white", squareColor: "white" },
  { square: "E1", piece: "K", color: "white", squareColor: "black" },
  // Column F
  { square: "F8", piece: "B", color: "black", squareColor: "black" },
  { square: "F7", piece: "P", color: "black", squareColor: "white" },
  { square: "F6", piece: null, color: null, squareColor: "black" },
  { square: "F5", piece: null, color: null, squareColor: "white" },
  { square: "F4", piece: null, color: null, squareColor: "black" },
  { square: "F3", piece: null, color: null, squareColor: "white" },
  { square: "F2", piece: "P", color: "white", squareColor: "black" },
  { square: "F1", piece: "B", color: "white", squareColor: "white" },
  // Column G
  { square: "G8", piece: "N", color: "black", squareColor: "white" },
  { square: "G7", piece: "P", color: "black", squareColor: "black" },
  { square: "G6", piece: null, color: null, squareColor: "white" },
  { square: "G5", piece: null, color: null, squareColor: "black" },
  { square: "G4", piece: null, color: null, squareColor: "white" },
  { square: "G3", piece: null, color: null, squareColor: "black" },
  { square: "G2", piece: "P", color: "white", squareColor: "white" },
  { square: "G1", piece: "N", color: "white", squareColor: "black" },
  // Column H
  { square: "H8", piece: "R", color: "black", squareColor: "black" },
  { square: "H7", piece: "P", color: "black", squareColor: "white" },
  { square: "H6", piece: null, color: null, squareColor: "black" },
  { square: "H5", piece: null, color: null, squareColor: "white" },
  { square: "H4", piece: null, color: null, squareColor: "black" },
  { square: "H3", piece: null, color: null, squareColor: "white" },
  { square: "H2", piece: "P", color: "white", squareColor: "black" },
  { square: "H1", piece: "R", color: "white", squareColor: "white" },
];

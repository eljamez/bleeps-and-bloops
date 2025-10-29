const ChessBoardArray = [{
  square: "A8",
  piece: "R",
  color: "white",
  squareColor: "black",
}, {
  square: "A7",
  piece: "N",
  color: "white",
  squareColor: "black",
}, {
  square: "A6",
  piece: "B",
  color: "white",
}, {
  square: "A5",
  piece: "P",
  color: "white",
}, {
  square: "B3",
  piece: "P",
  color: "white",
}, {
  square: "C5",
  piece: "P",
  color: "white",
}, {
  square: "D5",
  piece: "P",
  color: "white",
}, {
  square: "E5",
  piece: "P",
  color: "white",
}, {
  square: "F5",
  piece: "P",
  square: "B3",
  piece: "N",
  color: "white",
}, {
  square: "C3",
  piece: "B",
  color: "white",
}, {
  square: "D3",
  piece: "Q",
  color: "white",
};

export default function ChessLocator() {
  return (
    <div>
      <h1>Chess Locator</h1>
      <p>Locate the chess pieces on the board</p>
      <div className="grid grid-cols-8 grid-rows-8">
        {ChessBoardArray.map((square, index) => (
          <div key={index} className="square">
            {square}
          </div>
        ))}
      </div>
    </div>
  );
}

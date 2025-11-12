import { use, useState } from 'react'
import "./App.css";

function Square({value, onSquareClick, isHighlight}) {
  return (
    <button className={`square ${isHighlight ? 'highlight' : ''}`}
            onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X'
    }
    else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares, i);
  }
  const result = calculateWinner(squares);
  let status;
  //Status change
  if (result) {
    if (result.winner == null) {
      status = 'Draw!';
    }
    else {
      status = 'Winner: ' + result.winner;
    }
  }
  else {
    status = 'Next Player: ' + (xIsNext? 'X' : 'O');
  }
  const board = [];
  //Board change
  for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
    const row = []
    for (let colIdx = 0; colIdx <3; colIdx++) {
      let idx=rowIdx * 3 + colIdx;
      let winBoxCheck = false;
      if (result && result.line) {
        if (idx == result.line[0] || idx == result.line[1] || idx == result.line[2]) {
          winBoxCheck = true;
        }
      }
      row.push(
        <Square value={squares[rowIdx*3 + colIdx]} 
          onSquareClick={() => handleClick(rowIdx*3 + colIdx)} 
          isHighlight = {winBoxCheck}/>
      )
    }
    board.push(
      <div className='board-row'>
        {row}
      </div>
    )
  }
  //render
  return (
    <>
    <div className='status'>
      {status}
    </div>
    {board}
    </>
  )
}
function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [moveLocations, setMoveLocations] = useState([]);

  function handlePlay(nextSquares, squareIdx) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    const col = squareIdx % 3;
    const row = Math.floor(squareIdx / 3);
    setMoveLocations([...moveLocations.slice(0, currentMove), {row, col}]);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const {row, col} = moveLocations[move - 1];
      description = 'You are at move # ' + move + ' (' + row + ', ' + col +')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move == history.length - 1 ? (
        <div>{description}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const movesList = isAscending ? moves : [...moves].reverse();
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        
      </div>
      <div className="game-info">
        <button onClick={() => setAscending(!isAscending)}>
          Sort moves
        </button> 
        <ol>{movesList}</ol>
        
      </div>
    </div>
  );
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let isNotFull = false;
  for(let i = 0; i < 9; i++) {
    if (!squares[i]) isNotFull = true;
  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: lines[i]};
    }
  }
  if (!isNotFull) {
    return(
      {winner: null, line: []}
    )
  }
  return null;
}

export default App

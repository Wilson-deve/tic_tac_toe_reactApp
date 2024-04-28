import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function renderSquare(i, isWinnerSquare) {
    return (
      <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinnerSquare={isWinnerSquare} />
    );
  }
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  console.log('Winner info:', winnerInfo);
  let status;
  if (winnerInfo && winnerInfo.winner) {
    status = 'Winner: ' + winnerInfo.winner;
  } else if (squares.every(square => square !== null)){
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const winningLine = winnerInfo ? winnerInfo.line : [];

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const boardRow = [];
  for (let col = 0; col < 3; col++) {
    const squareIndex = row * 3 + col;
    const isWinnerSquare = winningLine.includes(squareIndex);
    boardRow.push(renderSquare(squareIndex, isWinnerSquare));
    
  }
    boardRows.push(<div key={row} className="board-row">{boardRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows} 
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setSortAscending(!sortAscending);
  }

  const moves = history.map((squares, move) =>{
    const row = Math.floor(move / 3);
    const col = move % 3;
    const desc = move ? `Go to move #${move} (${row}, ${col})`: 'Go to game start';
    // const isCurrentMove = move === currentMove;
    // const description = isCurrentMove ? 'You are at move #{move}' : desc;
    return(
      <li key={move}>
        {currentMove === move ? (<span>You are at move #{move}</span>) : (
        <button onClick={() => jumpTo(move)}>{desc}</button>
        )}
      </li>
    );
  });

  const sortedMoves = sortAscending ? moves.slice().reverse() : moves;

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleSortOrder}>{sortAscending ? 'Sort Descending' : 'Sort Ascending'}</button>
        </div>
        <ol>{sortedMoves}</ol>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: [a, b, c]};
    }
  }
  return null;
}

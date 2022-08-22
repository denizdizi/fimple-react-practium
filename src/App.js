import "./App.css";
import Board from "./Board";
import Square from "./Square";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';

const defaultSquares = () => new Array(9).fill(null);

// indexes of squares that must be filled with x or o to win the game
const squaresToWin = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // The number of filled squares shouldn't be a multiple of 2 for the computer to have the turn again.
    const isComputerTurn =
      squares.filter((square) => square !== null).length % 2 === 1;
    
    // Checks for the existence of the given values in lines 
    const findLinesValue = (a, b, c) => {
      return squaresToWin.filter((squareIndexes) => {
        const squareValues = squareIndexes.map((index) => squares[index]);
        return (
          JSON.stringify([a, b, c].sort()) ===
          JSON.stringify(squareValues.sort())
        );
      });
    };

    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);
    const isPlayerWon = findLinesValue("x", "x", "x").length > 0;
    const isComputerWon = findLinesValue("o", "o", "o").length > 0;

    if(!isPlayerWon && !isComputerWon && emptyIndexes.length === 1){
      setWinner("draw");
    }
    if (isPlayerWon) {
      setWinner("x");
    }
    if (!isPlayerWon && isComputerWon) {
      setWinner("o");
    }

    //Adds a new "o" if the player has not won.
    const putOToSquare = (index) => {
      if(!isPlayerWon){
        let newSquares = squares;
        newSquares[index] = "o";
        setSquares([...newSquares]);
      }
    };

    if (isComputerTurn) {
      const winingLines = findLinesValue("o", "o", null);
      if (winingLines.length > 0) {
        const winningIndex = winingLines[0].filter(
          (index) => squares[index] === null
        )[0];
        putOToSquare(winningIndex);
        return;
      }

      const blockToX = findLinesValue("x", "x", null);
      if (blockToX.length > 0) {
        const blockIndex = blockToX[0].filter(
          (index) => squares[index] === null
        )[0];
        putOToSquare(blockIndex);
        return;
      }

      const linesToContinue = findLinesValue("o", null, null);
      if (linesToContinue.length > 0) {
        putOToSquare(
          linesToContinue[0].filter((index) => squares[index] === null)[0]
        );
        return;
      }

      const randomIndex =
        emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      putOToSquare(randomIndex);

    }
  }, [squares]);

  // Handles click and set value of square
  function handleClickToSquare(index) {
    // The number of filled squares should be a multiple of 2 for the player to have the turn again.
    const isPlayerTurn =
      squares.filter((square) => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = "x";
      setSquares([...newSquares]);
    }
  }

  const restartGame = ()=>{
    let newSquares = squares;
      for (let index = 0; index < newSquares.length; index++) {
        newSquares[index] = null;
      }
      setSquares([...newSquares]);
      document.getElementById("result").style.display="none";

 }

  return (
    <main>
      <h3>Fimple React Practium</h3>
      <h5># Deniz Dogmus</h5>
      <hr/>
      <Board>
        {" "}
        {squares.map((square, index) => (
          <Square
            x={square === "x" ? 1 : 0}
            o={square === "o" ? 1 : 0}
            onClick={() => handleClickToSquare(index)}
          />
        ))}{" "}
      </Board>{" "}
      
      {!!winner && winner === "x" && (
        <div id="result" className="result green" style={{display:"block"}}>You WON!</div>
      )}{" "}
      {!!winner && winner === "o" && (
        <div id="result" className="result red" style={{display:"block"}}>You LOST!</div>
      )}{" "}
      {!!winner && winner === "draw" && (
        <div id="result" className="result yellow" style={{display:"block"}}>Draw!</div>
      )}{" "}

      <Button variant="primary" onClick={() => restartGame()}>Restart</Button>
    </main>
  );
}

export default App;
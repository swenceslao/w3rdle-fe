/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from 'components/Box';
import { GameContext } from 'context/GameContext';

const initializeLetters = () => {
  const defaultLetters = [];
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach((i) => {
    defaultLetters[i] = '';
  });
  return defaultLetters;
};

const initializeBoard = () => {
  const defaultBoard = [];
  for (let i = 0; i < 6; i += 1) {
    defaultBoard.push([]);
    for (let j = 0; j < 5; j += 1) {
      defaultBoard[i].push(['', '']);
    }
  }
  return defaultBoard;
};
function Board({
  restartGame,
  setRestartGame,
  win,
  setWin,
  clicks,
  error,
  singleLetter,
  lettersHandler,
  correct,
}) {
  const { setTries, lost, setLost } = useContext(GameContext);
  const [boardLetters, setBoardLetters] = useState(initializeLetters());
  const [board, setBoard] = useState(initializeBoard());
  const [changed, setChanged] = useState(false);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (win || lost) {
      // eslint-disable-next-line no-console
      console.log('Game ended!');
    } else if (clicks !== 0) {
      if (singleLetter === 'DEL') {
        setCol(col === 0 ? 0 : col - 1);
        setBoard((prevBoard) => {
          const prevBoardCopy = prevBoard.slice();
          prevBoardCopy[row][col === 0 ? 0 : col - 1][0] = '';
          return prevBoard;
        });
      } else {
        setBoard((prevBoard) => {
          const prevBoardCopy = prevBoard.slice();
          if (col < 5) {
            if (singleLetter !== 'ENTER') {
              prevBoardCopy[row][col][0] = singleLetter;
              setCol(col + 1);
            } else {
              error('Words are 5 letters long!');
              setTimeout(() => {
                error('');
              }, 1000);
            }
          } else if (singleLetter === 'ENTER') {
            let correctLetters = 0;
            // let word = '';
            // for (let i = 0; i < 5; i += 1) {
            //   word += prevBoardCopy[row][i][0];
            // }
            // if (words.includes(word.toLowerCase())) {
            for (let i = 0; i < 5; i += 1) {
              if (correct[i] === prevBoardCopy[row][i][0]) {
                prevBoardCopy[row][i][1] = 'C';
                correctLetters += 1;
              } else if (correct.includes(prevBoardCopy[row][i][0])) {
                prevBoardCopy[row][i][1] = 'E';
              } else {
                prevBoardCopy[row][i][1] = 'N';
              }

              setRow(row + 1);

              if (row === 5) {
                setLost(true);
                setTimeout(() => {
                  setMessage(`It was ${correct}.`);
                }, 750);
                setTimeout(() => {
                  setRestartGame(true);
                }, 2500);
              }

              setCol(0);
              setBoardLetters((prev) => {
                const prevCopy = prev.slice();
                // eslint-disable-next-line prefer-destructuring
                prevCopy[board[row][i][0]] = board[row][i][1];
                return prev;
              });
            }
            setChanged(!changed);

            if (correctLetters === 5) {
              setWin(true);
              setTimeout(() => {
                setMessage('You WIN');
              }, 750);
            }
            return prevBoard;
            // }
            // error('Word not in dictionary');
            // setTimeout(() => {
            //   error('');
            // }, 1000);
          }
          return prevBoard;
        });
      }
    }
  }, [clicks]);

  useEffect(() => {
    setTries(row);
  }, [row]);

  useEffect(() => {
    lettersHandler(boardLetters);
  }, [changed]);

  useEffect(() => {
    if (restartGame) {
      setBoardLetters(initializeLetters());
      setBoard(initializeBoard());
      setRow(0);
      setCol(0);
      setLost(false);
      setRestartGame(false);
    }
  }, [restartGame]);

  return (
    <div className="px-10 py-5 grid gap-y-1 items-center w-100 justify-center">
      {board.map((b, k) => (
        <div key={k} className="flex gap-1 w-fit">
          {b.map((value, j) => (
            <Box key={j} value={value[0]} state={value[1]} pos={j} />
          ))}
        </div>
      ))}
      {lost && (
        <div className="grid place-items-center text-sm text-center dark:text-white">
          Round lost. Don&apos;t worry, you can try again!
        </div>
      )}
      <div className="grid place-items-center h-8 text-center font-bold dark:text-white">
        {lost || win ? message : ''}
      </div>
    </div>
  );
}

Board.defaultProps = {
  singleLetter: '',
  correct: '',
};

Board.propTypes = {
  restartGame: PropTypes.bool.isRequired,
  setRestartGame: PropTypes.func.isRequired,
  win: PropTypes.bool.isRequired,
  setWin: PropTypes.func.isRequired,
  clicks: PropTypes.number.isRequired,
  error: PropTypes.func.isRequired,
  singleLetter: PropTypes.string,
  lettersHandler: PropTypes.func.isRequired,
  correct: PropTypes.string,
};

export default Board;

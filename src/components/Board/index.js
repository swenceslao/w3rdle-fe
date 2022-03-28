/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '../Box';
import words from '../../words';

const correct = 'CHANT';
const defaultBoard = [];
const defaultLetters = [];

'abcdefghijklmnopqrstuvwxyz'.split('').forEach((i) => {
  defaultLetters[i] = '';
});

for (let i = 0; i < 6; i += 1) {
  defaultBoard.push([]);
  for (let j = 0; j < 5; j += 1) {
    defaultBoard[i].push(['', '']);
  }
}

function Board({
  clicks, error, singleLetter, letters,
}) {
  const [boardLetters, setBoardLetters] = useState(defaultLetters);
  const [board, setBoard] = useState(defaultBoard);
  const [changed, setChanged] = useState(false);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [win, setWin] = useState(false);
  const [lost, setLost] = useState(false);
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
            let word = '';
            for (let i = 0; i < 5; i += 1) {
              word += prevBoardCopy[row][i][0];
            }
            if (words.includes(word.toLowerCase())) {
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
                    setMessage(`It was ${correct}`);
                  }, 750);
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
            }
            error('Word not in dictionary');
            setTimeout(() => {
              error('');
            }, 1000);
          }
          return prevBoard;
        });
      }
    }
  }, [clicks]);

  useEffect(() => {
    letters(boardLetters);
  }, [changed]);

  return (
    <div className="px-10 py-5 grid gap-y-1 items-center w-100 justify-center">
      {board.map((b, k) => (
        <div key={k} className="flex gap-1 w-fit">
          {b.map((value, j) => (
            <Box key={j} value={value[0]} state={value[1]} pos={j} />
          ))}
        </div>
      ))}
      <div className=" grid place-items-center h-8 font-bold dark:text-white">
        {lost || win ? message : ''}
      </div>
    </div>
  );
}

Board.defaultProps = {
  singleLetter: '',
};

Board.propTypes = {
  clicks: PropTypes.number.isRequired,
  error: PropTypes.func.isRequired,
  singleLetter: PropTypes.string,
  letters: PropTypes.func.isRequired,
};

export default Board;

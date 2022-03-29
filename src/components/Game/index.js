import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Board from '../Board';
import KeyBoard from '../KeyBoard';
import styles from './style.module.css';

function Game({ setError }) {
  const [singleLetter, setSingleLetter] = useState('');
  const [changed, setChanged] = useState(false);
  const [letters, setLetters] = useState({});
  const [clicked, setClicked] = useState(0);

  const onClickDown = (event) => {
    if (event.key === 'Enter') {
      setSingleLetter('ENTER');
      setClicked(clicked + 1);
    } else if (event.key === 'Backspace') {
      setSingleLetter('DEL');
      setClicked(clicked + 1);
    } else if ('abcdefghijklmnopqrstuvwxyz'.includes(event.key.toLowerCase())) {
      setSingleLetter(event.key.toUpperCase());
      setClicked(clicked + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onClickDown);

    return () => window.removeEventListener('keydown', onClickDown);
  });

  const keyHandler = (letterValue) => {
    setSingleLetter(letterValue);
    setClicked(clicked + 1);
  };
  const lettersHandler = (lettersValue) => {
    setLetters(lettersValue);
    setChanged(!changed);
  };
  return (
    <div className={styles.game}>
      <Board
        singleLetter={singleLetter}
        clicks={clicked}
        letters={lettersHandler}
        error={setError}
      />
      <KeyBoard keyHandler={keyHandler} letters={letters} changed={changed} />
    </div>
  );
}

Game.propTypes = {
  setError: PropTypes.func.isRequired,
};

export default Game;

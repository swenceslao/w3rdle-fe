import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Board from 'components/Board';
import KeyBoard from 'components/KeyBoard';
import Help from 'components/Help';
import styles from './style.module.css';

const W3RDL3_API_URL = process.env.REACT_APP_API_URL;
function Game({ setError }) {
  const [singleLetter, setSingleLetter] = useState('');
  const [changed, setChanged] = useState(false);
  const [letters, setLetters] = useState({});
  const [clicked, setClicked] = useState(0);
  const [win, setWin] = useState(false);
  const [correctWord, setCorrectWord] = useState('');

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
  const keyHandler = (letterValue) => {
    setSingleLetter(letterValue);
    setClicked(clicked + 1);
  };
  const lettersHandler = (lettersValue) => {
    setLetters(lettersValue);
    setChanged(!changed);
  };

  useEffect(() => {
    window.addEventListener('keydown', onClickDown);

    return () => window.removeEventListener('keydown', onClickDown);
  });

  useEffect(() => {
    const getRandomWord = async () => {
      const response = await fetch(`${W3RDL3_API_URL}/random`);
      const { currentWord } = await response.json();
      console.log({ currentWord });
      setCorrectWord(currentWord);
    };
    getRandomWord();
  }, []);

  return (
    <>
      <Modal
        title="You won!"
        open={win}
        setClose={() => setWin(false)}
      >
        <Help />
      </Modal>
      <div className={styles.game}>
        <Board
          singleLetter={singleLetter}
          clicks={clicked}
          letters={lettersHandler}
          error={setError}
          win={win}
          setWin={setWin}
          correct={correctWord}
        />
        <KeyBoard keyHandler={keyHandler} letters={letters} changed={changed} />
      </div>
    </>
  );
}

Game.propTypes = {
  setError: PropTypes.func.isRequired,
};

export default Game;

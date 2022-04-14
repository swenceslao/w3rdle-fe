/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BackspaceIcon from '@mui/icons-material/Backspace';

const keyboard = {
  line1: 'QWERTYUIOP',
  line2: 'ASDFGHJKL',
  line3: 'ZXCVBNM',
};

const defaultLetters = [];

'abcdefjhijklmnopqrstuvwxyz'.split('').forEach((i) => {
  defaultLetters[i] = '';
});

function Key({ getKey, state, value }) {
  const [defaultCss, setDefaultCss] = useState('bg-gray-200 hover:bg-gray-300 dark:bg-zinc-400 dark:text-white dark:hover:bg-zinc-500');

  const x = value.length === 1 ? 'w-7 sm:w-10 ' : 'p-2 sm:p-4 ';
  const returnKey = () => {
    getKey(value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (state === 'C') setDefaultCss('bg-correct text-white');
      if (state === 'E') setDefaultCss('bg-exist text-white');
      if (state === 'N') setDefaultCss('bg-wrong text-white dark:bg-gray-600');
    }, 350);
  }, [state]);

  return (
    <button
      className={
        `${x
        + defaultCss
        } h-14 300 grid items-center rounded font-semibold cursor-pointer`
      }
      type="button"
      onClick={returnKey}
    >
      {value === 'DEL' ? <BackspaceIcon /> : value}
    </button>
  );
}

Key.defaultProps = {
  state: '',
};

Key.propTypes = {
  getKey: PropTypes.func.isRequired,
  state: PropTypes.string,
  value: PropTypes.string.isRequired,
};

function KeyBoard({ letters, changed, keyHandler }) {
  const [keyboardLetters, setkeyboardLetters] = useState(defaultLetters);
  useEffect(() => {
    setkeyboardLetters(letters);
  }, [changed]);

  const keyboardKeyHandler = (value) => {
    keyHandler(value);
  };
  return (
    <div className="flex flex-col items-center w-100 pb-5">
      <div className="flex gap-1 my-0.5 w-fit">
        {keyboard.line1.split('').map((value, key) => (
          <Key
            getKey={keyboardKeyHandler}
            value={value}
            key={key}
            state={keyboardLetters[value]}
          />
        ))}
      </div>
      <div className="flex gap-1 my-0.5 w-fit">
        {keyboard.line2.split('').map((value, key) => (
          <Key
            getKey={keyboardKeyHandler}
            value={value}
            key={key}
            state={keyboardLetters[value]}
          />
        ))}
      </div>
      <div className="flex gap-1 my-0.5 w-fit">
        <Key value="ENTER" getKey={keyboardKeyHandler} />
        {keyboard.line3.split('').map((value, key) => (
          <Key
            getKey={keyboardKeyHandler}
            value={value}
            key={key}
            state={keyboardLetters[value]}
          />
        ))}
        <Key value="DEL" getKey={keyboardKeyHandler} />
      </div>
    </div>
  );
}

KeyBoard.propTypes = {
  changed: PropTypes.bool.isRequired,
  keyHandler: PropTypes.func.isRequired,
  letters: PropTypes.instanceOf(Object).isRequired,
};

export default KeyBoard;

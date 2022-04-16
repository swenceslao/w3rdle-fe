import React from 'react';
import PropTypes from 'prop-types';

function Box({ state, value }) {
  let defaultCss = 'text-black border-2 border-gray-300 dark:text-white';
  if (state === 'C') defaultCss = 'bg-emerald-500 text-white';
  if (state === 'E') defaultCss = 'bg-amber-500 text-white';
  if (state === 'N') defaultCss = 'bg-zinc-500 text-white dark:bg-gray-700';

  return (
    <div
      className={
        `w-8 h-8 sm:w-10 sm:h-10 grid place-items-center p-0 m-0 font-bold text-lg sm:text-2xl ${defaultCss}`
      }
    >
      {value}
    </div>
  );
}

Box.defaultProps = {
  state: '',
};

Box.propTypes = {
  state: PropTypes.string,
  value: PropTypes.string.isRequired,
};

function Help() {
  return (
    <div data-testid="help">
      <p className="text-left text-sm sm:text-base py-5 font-regular opacity-75 mr-1">
        Guess the WORDLE in six tries.
        <br />
        Each guess must be a valid five-letter word. Hit the enter button to
        submit.
        <br />
        {' '}
        After each guess, the color of the tiles will change to show how
        close your guess was to the word.
      </p>
      <hr />
      <h3 className="text-left font-bold py-5">Examples</h3>
      <div className="flex gap-1">
        <Box value="S" state="C" />
        <Box value="W" />
        <Box value="E" />
        <Box value="A" />
        <Box value="T" />
      </div>
      <p className="text-left text-sm sm:text-base py-2 opacity-75">
        The letter
        {' '}
        <strong>S</strong>
        {' '}
        is in the word and in the correct spot.
      </p>
      <div className="flex gap-1">
        <Box value="N" />
        <Box value="U" />
        <Box value="M" state="E" />
        <Box value="B" />
        <Box value="S" />
      </div>
      <p className="text-left text-sm sm:text-base py-2 opacity-75">
        The letter
        {' '}
        <strong>M</strong>
        {' '}
        is in the word but in the wrong spot.
      </p>
      <div className="flex gap-1">
        <Box value="F" />
        <Box value="L" state="N" />
        <Box value="A" />
        <Box value="T" />
        <Box value="S" />
      </div>
      <p className="text-left text-sm sm:text-base py-2 opacity-75">
        The letter
        {' '}
        <strong>N</strong>
        {' '}
        is not in the word.
      </p>
    </div>
  );
}

export default Help;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BackspaceIcon from '@mui/icons-material/Backspace';

function Box({ value, state, pos }) {
  const defaultCss = 'text-black border-2 border-gray-300 dark:bg-zinc-800 dark:text-white rounded';
  const [cssState, setCssState] = useState(defaultCss);

  useEffect(() => {
    if (state === 'C') {
      setTimeout(() => {
        setCssState('bg-correct text-white');
      }, 125 * pos);
    } else if (state === 'E') {
      setTimeout(() => {
        setCssState('bg-exist text-white');
      }, 125 * pos);
    } else if (state === 'N') {
      setTimeout(() => {
        setCssState('bg-wrong text-white');
      }, 125 * pos);
    } else {
      setTimeout(() => {
        setCssState(defaultCss);
      }, 750);
    }
  }, [state]);

  return (
    <div
      className={
        `h-12 w-12 sm:w-14 sm:h-14 grid place-items-center p-0 m-0 font-bold text-2xl rounded-sm ${cssState}`
      }
      data-testid="box"
    >
      {value === 'DEL' ? <BackspaceIcon /> : value}
    </div>
  );
}

Box.propTypes = {
  value: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired,
};

export default Box;

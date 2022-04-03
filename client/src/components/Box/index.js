import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BackspaceIcon from '@mui/icons-material/Backspace';

function Box({ value, state, pos }) {
  const [cssState, setCssState] = useState('text-black border-2 border-gray-300 dark:bg-zinc-800 dark:text-white rounded');

  useEffect(() => {
    setTimeout(() => {
      if (state === 'C') { setCssState('bg-correct text-white'); }
      if (state === 'E') { setCssState('bg-exist text-white'); }
      if (state === 'N') { setCssState('bg-wrong text-white dark:bg-gray-600'); }
    }, 125 * pos);
  }, [state]);

  return (
    <div
      className={
        `h-12 w-12 sm:w-14 sm:h-14 grid place-items-center p-0 m-0 font-bold text-2xl rounded-sm ${cssState}`
      }
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

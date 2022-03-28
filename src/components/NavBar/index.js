import React from 'react';
import PropTypes from 'prop-types';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Settings from '../Settings';

function NavBar({ help, darkness, dark }) {
  return (
    <div className="navbar flex w-100 justify-between items-center pt-5 py-3 sm:pt-3 text-black dark:text-white">
      <HelpOutlineIcon
        onClick={() => help(true)}
      />
      <h1 className="text-3xl font-bold tracking-wider">WORDLE</h1>
      <Settings darkness={darkness} dark={dark} />
    </div>
  );
}

NavBar.propTypes = {
  help: PropTypes.func.isRequired,
  darkness: PropTypes.func.isRequired,
  dark: PropTypes.bool.isRequired,
};

export default NavBar;

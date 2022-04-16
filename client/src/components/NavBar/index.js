import React from 'react';
import { Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Settings from '../Settings';

function NavBar({
  help, darkness, dark, walletAddress,
}) {
  return (
    <div data-testid="navbar" className="navbar flex w-100 justify-between items-center pt-5 py-3 sm:pt-3 text-black dark:text-white">
      <HelpOutlineIcon
        onClick={() => help(true)}
        sx={{ cursor: 'pointer' }}
        data-testid="help-icon"
      />
      <Stack>
        <h1 className="text-3xl font-bold tracking-wider">W3RDL3</h1>
        {walletAddress && <Typography variant="caption">{walletAddress}</Typography>}
      </Stack>
      <Settings darkness={darkness} dark={dark} />
    </div>
  );
}

NavBar.defaultProps = {
  walletAddress: '',
};

NavBar.propTypes = {
  help: PropTypes.func.isRequired,
  darkness: PropTypes.func.isRequired,
  dark: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
};

export default NavBar;

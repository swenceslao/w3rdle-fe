import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SettingsIcon from '@mui/icons-material/Settings';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Switch, Menu, Box,
} from '@mui/material';

function Settings({ dark, darkness }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = () => {
    darkness(!dark);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box data-testid="settings">
      <SettingsIcon
        onClick={handleClick}
        className="text-black dark:text-white"
        sx={{ cursor: 'pointer' }}
        data-testid="settings-icon"
      />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <FormControlLabel
          className="pl-3.5 text-slate-600"
          control={<Switch checked={dark} onChange={handleChange} />}
          label={dark ? 'Light mode' : 'Dark mode'}
          data-testid="form-label"
        />
      </Menu>
    </Box>
  );
}

Settings.propTypes = {
  dark: PropTypes.bool.isRequired,
  darkness: PropTypes.func.isRequired,
};

export default Settings;

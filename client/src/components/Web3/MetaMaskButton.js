import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Stack } from '@mui/material';
import MetamaskIcon from 'assets/images/metamask.png';

function MetaMaskButton({ status, onVerify, text }) {
  return (
    <Button
      disabled={status === 'unavailable' || text.toLowerCase().includes('metamask window open')}
      onClick={onVerify}
      variant="outlined"
      sx={{
        alignItems: 'center',
        display: 'flex',
        mx: 'auto',
        my: 1,
        py: 1,
      }}
    >
      <img
        style={{
          maxWidth: '100%',
          height: 24,
          marginRight: 12,
        }}
        src={MetamaskIcon}
        alt="MetaMask"
      />
      <Stack
        direction="column"
        alignItems="flex-start"
      >
        <Typography variant="button">
          {text}
        </Typography>
      </Stack>
    </Button>
  );
}

MetaMaskButton.propTypes = {
  status: PropTypes.oneOf(['unavailable', 'available']).isRequired,
  onVerify: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default MetaMaskButton;

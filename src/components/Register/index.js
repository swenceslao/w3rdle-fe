import React from 'react';
import PropTypes from 'prop-types';
import MetaMaskButton from 'components/Web3/MetaMaskButton';
import { Typography, Stack } from '@mui/material';

function RegisterInfoComponent({ windowEthStatus, handleConnect }) {
  return (
    <Stack mx={2} my={5}>
      <Typography variant="h4" className="text-black dark:text-white">
        To play W3RDL3
      </Typography>
      <Stack alignItems="flex-start" className="text-left text-black dark:text-white">
        <p>1. Connect your MetaMask wallet (on the MATIC network)</p>
        <p>2. Pay the mint price</p>
        <p>3. Play!</p>
      </Stack>
      <MetaMaskButton
        status={windowEthStatus}
        onVerify={handleConnect}
        text={windowEthStatus === 'available' ? 'Connect MetaMask Wallet' : 'MetaMask unavailable'}
      />
    </Stack>
  );
}

RegisterInfoComponent.propTypes = {
  windowEthStatus: PropTypes.string.isRequired,
  handleConnect: PropTypes.func.isRequired,
};

export default RegisterInfoComponent;

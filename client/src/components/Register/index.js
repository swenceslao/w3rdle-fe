import React from 'react';
import { Typography, Stack } from '@mui/material';

function RegisterInfoComponent() {
  return (
    <Stack mx={2} my={3} data-testid="register-info">
      <Typography variant="h4" className="text-black dark:text-white">
        To play W3RDL3
      </Typography>
      <Stack alignItems="flex-start" my={2} className="text-left text-black dark:text-white">
        <p>1. Connect your MetaMask wallet (on the MATIC network)</p>
        <p>2. Pay the mint price</p>
        <p>3. Play the game!</p>
        <p>4. If you win, mint the word to your wallet as an NFT!</p>
      </Stack>
    </Stack>
  );
}

export default RegisterInfoComponent;

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import getUnixTime from 'date-fns/getUnixTime';
import { Box, Typography, Grow } from '@mui/material';
import Board from 'components/Board';
import KeyBoard from 'components/KeyBoard';
import Error from 'components/Error';
import MetaMaskButton from 'components/Web3/MetaMaskButton';
import RegisterInfoComponent from 'components/Register';
import Modal from 'components/Modal';
import W3rdl3 from 'components/Web3/W3rdl3.json';
import styles from './style.module.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const WEI = 10e17;
const W3RDL3_API_URL = process.env.REACT_APP_API_URL;

function Game({ playSession, setPlaySession }) {
  const [ongoingMintPrice, setOngoingMintPrice] = useState(0.0);
  const [metamaskText, setMetamaskText] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [signerAddress, setSignerAddress] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [erc20Contract, setErc20Contract] = useState(null);
  const [windowEthStatus, setWindowEthStatus] = useState('unavailable');
  const [error, setError] = useState('');
  const [singleLetter, setSingleLetter] = useState('');
  const [changed, setChanged] = useState(false);
  const [letters, setLetters] = useState({});
  const [clicked, setClicked] = useState(0);
  const [winGame, setWinGame] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);
  const [restartGame, setRestartGame] = useState(false);
  const [restartGameDialog, setRestartGameDialog] = useState(false);
  const [wordMinted, setWordMinted] = useState(false);
  const [loadingWord, setLoadingWord] = useState(false);
  const [correctWord, setCorrectWord] = useState('');

  const onClickDown = (event) => {
    if (event.key === 'Enter') {
      setSingleLetter('ENTER');
      setClicked(clicked + 1);
    } else if (event.key === 'Backspace') {
      setSingleLetter('DEL');
      setClicked(clicked + 1);
    } else if ('abcdefghijklmnopqrstuvwxyz'.includes(event.key.toLowerCase())) {
      setSingleLetter(event.key.toUpperCase());
      setClicked(clicked + 1);
    }
  };

  const keyHandler = (letterValue) => {
    setSingleLetter(letterValue);
    setClicked(clicked + 1);
  };

  const lettersHandler = (lettersValue) => {
    setLetters(lettersValue);
    setChanged(!changed);
  };

  const handleConnect = async () => {
    setError('');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      if (provider) {
        console.log('MetaMask is installed! ', provider);
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {},
          }],
        });
        await provider.send('eth_requestAccounts', []);
        const ethSigner = await provider.getSigner();
        const ethSignerAddress = await ethSigner.getAddress();
        setSignerAddress(ethSignerAddress);
        console.log({ CONTRACT_ADDRESS, ethSigner, ethSignerAddress });

        const erc20 = new ethers.Contract(
          CONTRACT_ADDRESS,
          W3rdl3.abi,
          ethSigner,
        );

        setErc20Contract(erc20);

        const mintPriceHex = await erc20.ongoingMintPrice();
        const readableMintPrice = ethers.utils.formatEther(mintPriceHex);
        const floatMintPrice = parseFloat(readableMintPrice);
        setOngoingMintPrice(floatMintPrice);
        setMetamaskText('Pay With MetaMask Wallet');

        const register = await erc20.register({
          value: floatMintPrice * WEI,
        });
        const wait = await register.wait();
        const {
          blockHash,
          blockNumber,
          transactionHash: txHash,
        } = wait;

        setPlaySession({
          sessionStarted: getUnixTime(new Date()),
          playerAddress: signerAddress,
          blockInfo: {
            blockHash,
            blockNumber,
            txHash,
          },
        });

        // for hex https://string-functions.com/string-hex.aspx
        // sample IPFS gateway URL: https://gateway.ipfs.io/ipfs/QmSfur2vFgWokHtbPobr6P3YLyiCnYjWVjMgdE5xuaAFLF/racer.png

        // const mintWordRes = await erc20.mintWord(1, 0x776f726461);
      } else {
        setMetamaskText('MetaMask unavailable');
      }
    } catch (e) {
      console.error({ e });
      if (e.code && e.code === 4001) {
        setError('You have cancelled the request.');
      } else if (e.code && e.code !== 4001) {
        setError(`${e.message} (code ${e.code})`);
      } else {
        setError(`Something went wrong. Please open the devtools console for errors. ${JSON.stringify(e)}`);
      }
    }
  };

  const getRandomWord = useCallback(async () => {
    setLoadingWord(true);
    try {
      const response = await fetch(`${W3RDL3_API_URL}/random_word`);
      const { currentWord } = await response.json();
      console.log({ currentWord });
      setCorrectWord(currentWord);
    } catch (e) {
      console.error({ e });
    } finally {
      setLoadingWord(false);
    }
  }, []);

  useEffect(() => {
    if (playSession && Object.keys(playSession).length > 0) {
      setIsRegistered(true);
    }
  }, [playSession]);

  useEffect(() => {
    if (isRegistered) getRandomWord();
  }, [isRegistered]);

  useEffect(() => {
    const mintWord = async () => {
      setLoadingResult(true);
      try {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: signerAddress,
            word: correctWord,
          }),
        };
        const response = await fetch(`${W3RDL3_API_URL}/minted`, options);
        const { status } = response;
        if (status === 200) {
          setWordMinted(true);
        } else {
          setWordMinted(false);
          setWinGame(false);
          getRandomWord();
          setRestartGame(true);
          setRestartGameDialog(true);
        }
      } catch (e) {
        console.error({ e });
        setError('Something went wrong');
      } finally {
        setLoadingResult(false);
      }
    };
    if (winGame) {
      setPlaySession({});
      mintWord();
    }
  }, [winGame]);

  useEffect(() => {
    window.addEventListener('keydown', onClickDown);

    return () => window.removeEventListener('keydown', onClickDown);
  });

  useEffect(() => {
    if (!window.ethereum) {
      setWindowEthStatus('unavailable');
      setMetamaskText('MetaMask unavailable');
    } else {
      setWindowEthStatus('available');
      setMetamaskText('Connect MetaMask Wallet');
    }
  }, []);

  return (
    <>
      <Modal
        title="Word expired!"
        open={restartGameDialog}
        setClose={() => setRestartGameDialog(false)}
      >
        <p className="text-black dark:text-white">
          Word has expired. Close this dialog to restart the game!
        </p>
      </Modal>
      <Modal
        title="Please wait..."
        open={loadingResult}
        setClose={() => setLoadingResult(false)}
      >
        <p className="text-black dark:text-white">
          Finalizing game...
        </p>
      </Modal>
      <Modal
        title="You WIN!"
        open={winGame && wordMinted}
      >
        <p className="text-black dark:text-white">
          Congratulations!
        </p>
      </Modal>
      {error && <Error>{error}</Error>}
      {!isRegistered ? (
        <>
          <RegisterInfoComponent />
          {Boolean(ongoingMintPrice) && (
            <Typography variant="p" className="text-black dark:text-white">
              Mint price:
              {' '}
              {ongoingMintPrice}
              {' '}
              MATIC
            </Typography>
          )}
          <MetaMaskButton
            status={windowEthStatus}
            onVerify={handleConnect}
            text={metamaskText}
          />
        </>
      ) : (
        <div className={styles.game}>
          <Grow in={loadingWord}>
            <p className="text-black dark:text-white">
              Loading word...
            </p>
          </Grow>
          <Grow
            in={!loadingWord}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(!loadingWord ? { timeout: 500 } : {})}
          >
            <Box>
              <Board
                restartGame={restartGame}
                setRestartGame={setRestartGame}
                singleLetter={singleLetter}
                clicks={clicked}
                lettersHandler={lettersHandler}
                error={setError}
                win={winGame}
                setWin={setWinGame}
                correct={correctWord}
              />
              <KeyBoard keyHandler={keyHandler} letters={letters} changed={changed} />
            </Box>
          </Grow>
        </div>
      )}
    </>
  );
}

Game.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  playSession: PropTypes.object.isRequired,
  setPlaySession: PropTypes.func.isRequired,
};

export default Game;

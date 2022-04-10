import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import getUnixTime from 'date-fns/getUnixTime';
import { Typography } from '@mui/material';
import Board from 'components/Board';
import KeyBoard from 'components/KeyBoard';
import Error from 'components/Error';
import MetaMaskButton from 'components/Web3/MetaMaskButton';
import RegisterInfoComponent from 'components/Register';
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
  const [signer, setSigner] = useState('');
  const [erc20Contract, setErc20Contract] = useState(null);
  const [windowEthStatus, setWindowEthStatus] = useState('unavailable');
  const [error, setError] = useState('');
  const [singleLetter, setSingleLetter] = useState('');
  const [changed, setChanged] = useState(false);
  const [letters, setLetters] = useState({});
  const [clicked, setClicked] = useState(0);
  const [win, setWin] = useState(false);
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
        setSigner(ethSigner);
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
        console.log({ readableMintPrice });
        setOngoingMintPrice(parseFloat(readableMintPrice));
        setMetamaskText('Pay With MetaMask Wallet');

        // const params = {
        //   value: 1000000000000000,
        // };

        // const params = {
        //   value: readableMintPrice * WEI,
        // };

        // const registerRes = await erc20.register(params);
        // const wait = await registerRes.wait(registerRes);
        // console.log({ wait });
        // const {
        //   blockHash,
        //   blockNumber,
        //   transactionHash: txHash,
        // } = wait;

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

  const handleRegister = async () => {
    try {
      const register = await erc20Contract.register({
        value: ongoingMintPrice * WEI,
      });
      const wait = await register.wait();
      console.log({ wait });
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
    } catch (e) {
      console.error({ e });
    }
  };

  useEffect(() => {
    if (playSession && Object.keys(playSession).length > 0) {
      setIsRegistered(true);
    }
  }, [playSession]);

  useEffect(() => {
    const getRandomWord = async () => {
      const response = await fetch(`${W3RDL3_API_URL}/random`);
      const { currentWord } = await response.json();
      console.log({ currentWord });
      setCorrectWord(currentWord);
    };
    if (isRegistered) getRandomWord();
  }, [isRegistered]);

  useEffect(() => {
    if (win) setPlaySession({});
  }, [win]);

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
            onVerify={ongoingMintPrice ? handleRegister : handleConnect}
            text={metamaskText}
          />
        </>
      ) : (
        <div className={styles.game}>
          <Board
            singleLetter={singleLetter}
            clicks={clicked}
            letters={lettersHandler}
            error={setError}
            win={win}
            setWin={setWin}
            correct={correctWord}
          />
          <KeyBoard keyHandler={keyHandler} letters={letters} changed={changed} />
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

import React, {
  useState, useEffect, useCallback, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react';
import { ethers } from 'ethers';
import {
  getFacebookUrl, getTwitterUrl, getWhatsAppUrl,
} from '@phntms/react-share';
import getUnixTime from 'date-fns/getUnixTime';
import {
  Box, Stack, Typography, Grow, Link, Button,
} from '@mui/material';
import { Image } from 'mui-image';
import { SocialIcon } from 'react-social-icons';
import Board from 'components/Board';
import KeyBoard from 'components/KeyBoard';
import Error from 'components/Error';
import MetaMaskButton from 'components/Web3/MetaMaskButton';
import RegisterInfoComponent from 'components/Register';
import Modal from 'components/Modal';
import W3rdl3 from 'components/Web3/W3rdl3.json';
import { GameContext } from 'context/GameContext';
import loadingAnimation from 'assets/lottie/loading.json';
import rocketAnimation from 'assets/lottie/rocket.json';
import OpenSeaIconForLightBg from 'assets/images/OpenSea-Full-Logo-darktext.png';
import OpenSeaIconForDarkBg from 'assets/images/OpenSea-Full-Logo-lighttext.png';
import styles from './style.module.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const W3RDL3_API_URL = process.env.REACT_APP_API_URL;
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;
const IPFS_CID = process.env.REACT_APP_IPFS_CID;
const WEI = 10e17;

const generateIpfsUrl = (word) => `${IPFS_GATEWAY}${IPFS_CID}/${word}.png`;
const generateOpenseaUrl = (contractAddress, nftId) => `https://opensea.io/${contractAddress}/${nftId}`;

function stringToHex(str) {
  const arr1 = [];
  for (let n = 0, l = str.length; n < l; n += 1) {
    const hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('').toString();
}

function Game({ darkMode, playSession, setPlaySession }) {
  const { tries } = useContext(GameContext);
  const [ongoingMintPrice, setOngoingMintPrice] = useState(0.0);
  const [metamaskText, setMetamaskText] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [signerAddress, setSignerAddress] = useState('');
  const [erc20Contract, setErc20Contract] = useState(null);
  const [nftId, setNftId] = useState(null);
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
  const [loadingWord, setLoadingWord] = useState(false);
  const [awaitingRegister, setAwaitingRegister] = useState(false);
  const [correctWord, setCorrectWord] = useState('');
  const [finalSuccess, setFinalSuccess] = useState(false);
  const [playRocket, setPlayRocket] = useState('false');

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
        console.log('MetaMask is installed!');
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
        setAwaitingRegister(true);

        const wait = await register.wait();
        const {
          blockHash,
          blockNumber,
          transactionHash: txHash,
        } = wait;
        setAwaitingRegister(false);

        setPlaySession({
          sessionStarted: getUnixTime(new Date()),
          playerAddress: ethSignerAddress,
          blockInfo: {
            blockHash,
            blockNumber,
            txHash,
          },
        });

        // sample IPFS gateway URL: https://gateway.ipfs.io/ipfs/QmSfur2vFgWokHtbPobr6P3YLyiCnYjWVjMgdE5xuaAFLF/racer.png
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
    } finally {
      setAwaitingRegister(false);
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

  const renderSocialShareButtons = useMemo(() => {
    const socials = [
      {
        icon: 'facebook',
        url: getFacebookUrl({ url: generateIpfsUrl(correctWord) }),
      },
      {
        icon: 'twitter',
        url: getTwitterUrl({ url: generateIpfsUrl(correctWord) }),
      },
      {
        icon: 'whatsapp',
        url: getWhatsAppUrl({ url: generateIpfsUrl(correctWord) }),
      },
    ];
    return (
      <Stack direction="row" alignItems="center">
        {socials.map(({ icon, url }) => (
          <Box key={icon} mx={1}>
            <SocialIcon target="_blank" rel="noopener" key={icon} label={icon} url={url} />
          </Box>
        ))}
      </Stack>
    );
  }, [correctWord]);

  const renderLoadingComponent = useMemo(() => (
    <Lottie
      animationData={loadingAnimation}
      loop
      style={{
        width: '20%',
        margin: '0 auto',
      }}
    />
  ), []);

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
          const hex = `0x${stringToHex(correctWord)}`;
          const mintWordRes = await erc20Contract.mintWord(tries, hex);
          const openseaNftId = ethers.utils.formatUnits(mintWordRes.value, 0);
          setNftId(openseaNftId);
          await mintWordRes.wait();

          setPlaySession({});
          setIsRegistered(false);
          setFinalSuccess(true);
          setPlayRocket(true);
        } else {
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
      mintWord();
    }
  }, [winGame]);

  useEffect(() => {
    if (playRocket) {
      setTimeout(() => {
        setPlayRocket(false);
      }, 5800);
    }
  }, [playRocket]);

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
        title="Waiting for block..."
        open={awaitingRegister}
      >
        <Box>
          {renderLoadingComponent}
          <p className="text-black dark:text-white">
            Waiting for transaction to be successfully included on the blockchain...
          </p>
        </Box>
      </Modal>
      <Modal
        title="Word expired!"
        open={restartGameDialog}
        setClose={() => setRestartGameDialog(false)}
      >
        <p className="text-black dark:text-white">
          Word has expired. Close this dialog to get a new word to play!
        </p>
      </Modal>
      <Modal
        title="Finalizing game..."
        open={loadingResult}
        setClose={() => setLoadingResult(false)}
      >
        <Box>
          {renderLoadingComponent}
        </Box>
      </Modal>
      {error && <Error>{error}</Error>}
      {(!finalSuccess) && (
        !isRegistered ? (
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
            <Grow in={loadingWord} unmountOnExit>
              <Box>
                <Lottie
                  animationData={loadingAnimation}
                  loop
                  style={{
                    width: '30%',
                    margin: '0 auto',
                  }}
                />
                <p className="text-gray-700 italic dark:text-slate-300">
                  Loading...
                </p>
              </Box>
            </Grow>
            <Grow
              in={!loadingWord}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(!loadingWord ? { timeout: 1500 } : {})}
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
        )
      )}
      {(finalSuccess) && (
        <Box mt={2}>
          <Grow in={Boolean(finalSuccess && playRocket)} unmountOnExit>
            <Box maxWidth="50%" mx="auto">
              <Lottie animationData={rocketAnimation} />
            </Box>
          </Grow>
          <Grow
            in={Boolean(finalSuccess && !playRocket)}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...((finalSuccess && !playRocket) ? { timeout: 800 } : {})}
          >
            <Stack direction="column" alignItems="center" textAlign="center">
              <p className="mt-5 text-black dark:text-white font-black text-2xl">
                Congratulations!
              </p>
              <p className="mt-5 mb-2 dark:text-white">
                Your NFT image is being generated from the InterPlanetary File System (IPFS).
                Sit back and relax!
              </p>
              <Image
                src={generateIpfsUrl(correctWord.toLowerCase())}
                width="max-content"
                alt={`minted word: ${correctWord}`}
                showLoading={(
                  <Box mt={5}>
                    {renderLoadingComponent}
                  </Box>
                )}
              />
              <p className="mt-5 dark:text-white">
                Share your NFT below
              </p>
              <Button
                component={Link}
                href={generateOpenseaUrl(CONTRACT_ADDRESS, nftId)}
                variant="body2"
                target="_blank"
                rel="noopener"
                className="dark:text-white"
                sx={{ my: 2 }}
              >
                <img
                  src={darkMode ? OpenSeaIconForDarkBg : OpenSeaIconForLightBg}
                  alt="External link to your minted NFT on OpenSea"
                  width={180}
                />
              </Button>
              {renderSocialShareButtons}
            </Stack>
          </Grow>
        </Box>
      )}
    </>
  );
}

Game.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  playSession: PropTypes.object.isRequired,
  setPlaySession: PropTypes.func.isRequired,
};

export default Game;

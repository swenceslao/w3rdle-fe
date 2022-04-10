import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import getUnixTime from 'date-fns/getUnixTime';
import { Typography } from '@mui/material';
import { useLocalstorage } from 'rooks';
import NavBar from 'components/NavBar';
import Game from 'components/Game';
import RegisterInfoComponent from 'components/Register';
import Error from 'components/Error';
import Modal from 'components/Modal';
import Help from 'components/Help';
import styles from 'components/Game/style.module.css';
import W3rdl3 from 'components/Web3/W3rdl3.json';
import MetaMaskButton from 'components/Web3/MetaMaskButton';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const WEI = 10e17;

function App() {
  const [playSession, setPlaySession] = useLocalstorage('w3rdl3_play_session', {});
  const [ongoingMintPrice, setOngoingMintPrice] = useState(0.0);
  const [metamaskText, setMetamaskText] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [signerAddress, setSignerAddress] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [signer, setSigner] = useState('');
  const [erc20Contract, setErc20Contract] = useState(null);
  const [windowEthStatus, setWindowEthStatus] = useState('unavailable');
  const [openHelp, setOpenHelp] = useState(false);
  const [dark, setDark] = useState(false);
  const [error, setError] = useState('');

  const darkHandler = (darkSelected) => {
    if (darkSelected) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleConnect = async () => {
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
    if (!window.ethereum) {
      setWindowEthStatus('unavailable');
      setMetamaskText('MetaMask unavailable');
    } else {
      setWindowEthStatus('available');
      setMetamaskText('Connect MetaMask Wallet');
    }
  }, []);

  useEffect(() => {
    if (playSession && Object.keys(playSession).length > 0) {
      setIsRegistered(true);
    }
  }, [playSession]);

  useEffect(() => {
    darkHandler(dark);
  }, [dark]);

  return (
    <div className="app dark:bg-zinc-800">
      <Modal
        title="How to play!"
        open={openHelp}
        setClose={() => setOpenHelp(false)}
      >
        <Help />
      </Modal>
      {error && <Error>{error}</Error>}
      <div className={styles.game}>
        <NavBar
          help={setOpenHelp}
          darkness={setDark}
          dark={dark}
          walletAddress={
            playSession && Object.keys(playSession).length > 0
              ? playSession.playerAddress
              : ''
          }
        />
      </div>
      {!isRegistered
        ? (
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
        )
        : (
          <Game setError={setError} />
        )}
    </div>
  );
}

export default App;

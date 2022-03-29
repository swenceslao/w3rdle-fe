import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import getUnixTime from 'date-fns/getUnixTime';
import { useLocalstorage } from 'rooks';
import NavBar from 'components/NavBar';
import Game from 'components/Game';
import RegisterInfoComponent from 'components/Register';
import Error from 'components/Error';
import Modal from 'components/Modal';
import Help from 'components/Help';
import styles from 'components/Game/style.module.css';

function App() {
  const [playSession, setPlaySession] = useLocalstorage('w3rdle_play_session', {});
  const [isRegistered, setIsRegistered] = useState(false);
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
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log({ signer, signerAddress });
        setPlaySession({
          sessionStarted: getUnixTime(new Date()),
          playerAddress: signerAddress,
        });
      } else {
        console.log('MetaMask is unavailable');
      }
    } catch (e) {
      console.error({ e });
    }
  };

  useEffect(() => {
    if (!window.ethereum) {
      setWindowEthStatus('unavailable');
    } else {
      setWindowEthStatus('available');
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
      {openHelp && (
        <Modal title="How to play!" help={setOpenHelp}>
          <Help />
        </Modal>
      )}
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
        ? <RegisterInfoComponent windowEthStatus={windowEthStatus} handleConnect={handleConnect} />
        : <Game darkness={darkHandler} setError={setError} /> }
    </div>
  );
}

export default App;

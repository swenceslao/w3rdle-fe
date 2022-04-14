import React, { useState, useEffect } from 'react';
import './App.css';
import { useLocalstorage } from 'rooks';
import NavBar from 'components/NavBar';
import Game from 'components/Game';
import Modal from 'components/Modal';
import Help from 'components/Help';
import styles from 'components/Game/style.module.css';
import GameContextProvider from 'context/GameContext';

function App() {
  const [playSession, setPlaySession] = useLocalstorage('w3rdl3_play_session', {});
  const [openHelp, setOpenHelp] = useState(false);
  const [dark, setDark] = useState(false);

  const darkHandler = (darkSelected) => {
    if (darkSelected) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

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
      <GameContextProvider>
        <Game
          darkMode={dark}
          playSession={playSession}
          setPlaySession={setPlaySession}
        />
      </GameContextProvider>
    </div>
  );
}

export default App;

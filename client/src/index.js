import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GameContextProvider from 'context/GameContext';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

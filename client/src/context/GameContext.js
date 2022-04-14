import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const GameContext = createContext({});

function GameContextProvider({ children }) {
  const [tries, setTries] = useState(0);
  const [lost, setLost] = useState(false);

  const value = useMemo(() => ({
    tries,
    setTries,
    lost,
    setLost,
  }), [tries, lost]);

  return (
    <GameContext.Provider
      value={value}
    >
      {children}
    </GameContext.Provider>
  );
}

GameContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default GameContextProvider;

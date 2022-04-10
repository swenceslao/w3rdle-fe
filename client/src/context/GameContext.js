import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const GameContext = createContext({});

function GameContextProvider({ children }) {
  const [tries, setTries] = useState(0);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <GameContext.Provider value={{ tries, setTries }}>
      {children}
    </GameContext.Provider>
  );
}

GameContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default GameContextProvider;

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Board from 'components/Board';
import GameContextProvider from 'context/GameContext';
import moxios from 'moxios';
import {
  render,
} from './testUtils';

const setRestartGame = jest.fn(() => {});
const setWin = jest.fn(() => {});
const error = jest.fn(() => {});
const lettersHandler = jest.fn(() => {});

const defaultProps = {
  restartGame: false,
  setRestartGame,
  win: false,
  setWin,
  clicks: 0,
  error,
  singleLetter: '',
  lettersHandler,
  correctWord: '', // correctWord passed from Game
};

const renderComponent = (props = defaultProps) => render(
  <GameContextProvider>
    <Board {...props} />
  </GameContextProvider>,
);

describe('wordle board', () => {
  it('should empty render board', () => {
    const { queryByTestId, queryAllByTestId } = renderComponent();
    expect(queryByTestId('board')).toBeInTheDocument();
    expect(queryByTestId('round-lost-text')).not.toBeInTheDocument();
    expect(queryByTestId('correct-word-text')).not.toHaveTextContent();
    expect(queryAllByTestId('box')).toHaveLength(30);
  });

  it('should render ost round text', (done) => {
    const { getByTestId } = renderComponent({
      ...defaultProps,
      lost: true,
    });
    moxios.wait(() => {
      expect(getByTestId('board')).toBeInTheDocument();
      expect(getByTestId('round-lost-text')).toBeInTheDocument();
      expect(getByTestId('round-lost-text')).toHaveTextContent("Round lost. Don't worry, you can try again!");
    }, 500);
    done();
  });
});

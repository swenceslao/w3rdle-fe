/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Box from 'components/Box';
import moxios from 'moxios';
import {
  render, within,
} from './testUtils';

const defaultProps = {
  value: '',
  state: '',
  pos: 0,
};

const renderComponent = (props = defaultProps) => render(<Box {...props} />);

describe('game boxes', () => {
  it('should render empty box at pos 0', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('box')).toBeInTheDocument();
  });

  it('should render W box at pos 1', (done) => {
    const { getByTestId } = renderComponent({
      value: 'W',
      state: '',
      pos: 1,
    });
    moxios.wait(() => {
      const box = getByTestId('box');
      expect(box).toBeInTheDocument();
      expect(within(box).getByText('W')).toBeInTheDocument();
      expect(box).toHaveClass('text-black border-2 border-gray-300 dark:bg-zinc-800 dark:text-white rounded');
    }, 500);
    done();
  });

  it('should render P box at pos 2 with state incorrect', (done) => {
    const { getByTestId } = renderComponent({
      value: 'P',
      state: 'N',
      pos: 2,
    });
    moxios.wait(() => {
      const box = getByTestId('box');
      expect(box).toBeInTheDocument();
      expect(within(box).getByText('P')).toBeInTheDocument();
      expect(box).toHaveClass('bg-wrong text-white');
    }, 500);
    done();
  });

  it('should render A box at pos 3 with state exist', (done) => {
    const { getByTestId } = renderComponent({
      value: 'A',
      state: 'N',
      pos: 3,
    });
    moxios.wait(() => {
      const box = getByTestId('box');
      expect(box).toBeInTheDocument();
      expect(within(box).getByText('A')).toBeInTheDocument();
      expect(box).toHaveClass('bg-exist text-white');
    }, 500);
    done();
  });

  it('should render S box at pos 4 with state correct', (done) => {
    const { getByTestId } = renderComponent({
      value: 'S',
      state: 'C',
      pos: 4,
    });
    moxios.wait(() => {
      const box = getByTestId('box');
      expect(box).toBeInTheDocument();
      expect(within(box).getByText('A')).toBeInTheDocument();
      expect(box).toHaveClass('bg-correct text-white');
    }, 500);
    done();
  });
});

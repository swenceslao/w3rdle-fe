/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Modal from 'components/Modal';
import {
  render, within, fireEvent,
} from './testUtils';

const setClose = jest.fn(() => {});

const defaultProps = {
  title: 'How to play',
  open: true,
  setClose,
  children: (
    <p>This is modal content</p>
  ),
};

const renderComponent = (props = defaultProps) => render(<Modal {...props} />);

describe('modal', () => {
  test('should show a default modal', () => {
    const { getByTestId } = renderComponent();
    const modal = getByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('How to play')).toBeInTheDocument();
    expect(within(modal).getByText('This is modal content')).toBeInTheDocument();
    expect(within(modal).getByTestId('close-icon')).toBeInTheDocument();
  });

  test('should call setClose', () => {
    const { getByTestId } = renderComponent();
    const modal = getByTestId('modal');
    expect(modal).toBeInTheDocument();
    fireEvent.click(getByTestId('close-icon'));
    expect(setClose).toHaveBeenCalled();
  });
});

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import NavBar from 'components/NavBar';
import {
  render, within, fireEvent,
} from './testUtils';

const help = jest.fn(() => {});
const darkness = jest.fn(() => {});

const defaultProps = {
  help,
  darkness,
  dark: false,
  walletAddress: '',
};

const renderComponent = (props = defaultProps) => render(<NavBar {...props} />);

describe('navbar', () => {
  it('should show a default navbar', () => {
    const { getByTestId } = renderComponent();
    const navbar = getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('should show call help btn fn', () => {
    const { getByTestId } = renderComponent();
    const navbar = getByTestId('navbar');
    const helpBtn = within(navbar).getByTestId('help-icon');
    expect(helpBtn).toBeInTheDocument();
    fireEvent.click(helpBtn);
    expect(help).toHaveBeenCalled();
  });

  it('should show wallet address', () => {
    const walletAddress = '0x929aB7A6a6558Be5BA707F5a3D2F7d70b0Bb333f';
    const { getByTestId } = renderComponent({
      ...defaultProps,
      walletAddress,
    });
    const navbar = getByTestId('navbar');
    expect(within(navbar).getByText(walletAddress)).toBeInTheDocument();
  });
});

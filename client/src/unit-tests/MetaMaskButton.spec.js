/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import MetaMaskButton from 'components/Web3/MetaMaskButton';
import {
  render, fireEvent,
} from './testUtils';

const onVerify = jest.fn(() => {});

const renderComponent = (props) => render(<MetaMaskButton {...props} />);

describe('metamask button', () => {
  it('should render metamask button as available', () => {
    const { getByTestId } = renderComponent({
      status: 'available',
      onVerify,
      text: 'Connect',
    });
    const btn = getByTestId('metamask-button');
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveTextContent('Connect');
  });

  it('should render metamask button as unavailable', () => {
    const { getByTestId } = renderComponent({
      status: 'unavailable',
      onVerify,
      text: 'Connect',
    });
    const btn = getByTestId('metamask-button');
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it('should render execute the callback function passed to the button', () => {
    const { getByTestId } = renderComponent({
      status: 'available',
      onVerify,
      text: 'Connect',
    });
    const btn = getByTestId('metamask-button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onVerify).toHaveBeenCalled();
  });
});

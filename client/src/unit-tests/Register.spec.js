import React from 'react';
import RegisterInfoComponent from 'components/Register';
import {
  render, within,
} from './testUtils';

describe('register info component', () => {
  it('should render how to register', () => {
    const { getByTestId } = render(<RegisterInfoComponent />);
    const registerInfo = getByTestId('register-info');
    expect(registerInfo).toBeInTheDocument();
    expect(within(registerInfo).getByText('To play W3RDL3')).toBeInTheDocument();
  });
});

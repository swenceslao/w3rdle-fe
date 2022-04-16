/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Help from 'components/Help';
import {
  render,
} from './testUtils';

const renderComponent = (props) => render(<Help {...props} />);

describe('help dialog', () => {
  it('should render help dialog', () => {
    const { getByTestId, getByText } = renderComponent();
    expect(getByTestId('help')).toBeInTheDocument();
    expect(getByText('Examples')).toBeInTheDocument();
  });
});

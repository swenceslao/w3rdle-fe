/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Error from 'components/Error';
import {
  render, within,
} from './testUtils';

const renderComponent = (props) => render(<Error {...props} />);

describe('error', () => {
  it('should render error message', () => {
    const errorMsg = 'This is an error message';
    const { getByTestId } = renderComponent({
      children: errorMsg,
    });
    const error = getByTestId('error');
    expect(error).toBeInTheDocument();
    expect(within(error).getByText(errorMsg)).toBeInTheDocument();
  });
});

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Settings from 'components/Settings';
import moxios from 'moxios';
import {
  render, within, fireEvent,
} from './testUtils';

const darkness = jest.fn(() => {});

const defaultProps = {
  dark: false,
  darkness,
};

const renderComponent = (props = defaultProps) => render(<Settings {...props} />);

describe('settings', () => {
  it('should render settings icon', () => {
    const { getByTestId } = renderComponent();
    const settings = getByTestId('settings');
    expect(settings).toBeInTheDocument();
    const settingsIcon = within(settings).getByTestId('settings-icon');
    expect(settingsIcon).toBeInTheDocument();
  });

  it('should open settings menu', (done) => {
    const { getByTestId } = renderComponent();
    const settings = getByTestId('settings');
    const settingsIcon = within(settings).getByTestId('settings-icon');
    fireEvent.click(settingsIcon);
    moxios.wait(() => {
      expect(within(settings).getByTestId('form-label')).toBeInTheDocument();
    });
    done();
  });

  it('should toggle dark mode', (done) => {
    const { getByTestId } = renderComponent();
    const settings = getByTestId('settings');
    const settingsIcon = within(settings).getByTestId('settings-icon');
    fireEvent.click(settingsIcon);
    moxios.wait(() => {
      const formLabel = within(settings).getByTestId('form-label');
      expect(formLabel).toHaveTextContent('Dark mode');
      fireEvent.click(formLabel);
      expect(darkness).toHaveBeenCalled();
      expect(formLabel).toHaveTextContent('Light mode');
    });
    done();
  });
});

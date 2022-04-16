import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const customRender = (ui) => render(ui);

// re-export everything
// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';

// override render method
export { customRender as render };

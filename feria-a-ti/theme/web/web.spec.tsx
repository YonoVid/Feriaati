import React from 'react';
import { render } from '@testing-library/react';
import { BasicWeb } from './web.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicWeb />);
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});

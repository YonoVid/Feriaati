import React from 'react';
import { render } from '@testing-library/react-native';
import { BasicMobile } from './mobile.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicMobile />);
  const rendered = getByText('hello from Mobile');
  expect(rendered).toBeTruthy();
});

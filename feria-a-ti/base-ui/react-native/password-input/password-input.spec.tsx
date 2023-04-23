import React from 'react';
import { render } from '@testing-library/react-native';
import { BasicPasswordInput } from './password-input.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicPasswordInput />);
  const rendered = getByText('hello from PasswordInput');
  expect(rendered).toBeTruthy();
});

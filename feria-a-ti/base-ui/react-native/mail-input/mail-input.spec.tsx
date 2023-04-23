import React from 'react';
import { render } from '@testing-library/react-native';
import { BasicMailInput } from './mail-input.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicMailInput />);
  const rendered = getByText('hello from MailInput');
  expect(rendered).toBeTruthy();
});

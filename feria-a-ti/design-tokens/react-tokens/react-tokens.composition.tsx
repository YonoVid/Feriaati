import React from 'react';
import { reactTokens } from './react-tokens';

export function ReturnsCorrectValue() {
  return <div>{reactTokens()}</div>;
}

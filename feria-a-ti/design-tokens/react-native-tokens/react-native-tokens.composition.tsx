import React from 'react';
import { reactNativeTokens } from './react-native-tokens';

export function ReturnsCorrectValue() {
  return <div>{reactNativeTokens()}</div>;
}

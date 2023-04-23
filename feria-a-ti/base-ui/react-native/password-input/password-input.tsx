import React from 'react';
import { Text, StyleSheet } from 'react-native';

export type PasswordInputProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function PasswordInput({ text }: PasswordInputProps) {
  return (
    <Text style={styles.text}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {},
});

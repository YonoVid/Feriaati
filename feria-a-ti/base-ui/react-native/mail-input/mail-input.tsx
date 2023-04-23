import React from 'react';
import { Text, StyleSheet } from 'react-native';

export type MailInputProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function MailInput({ text }: MailInputProps) {
  return (
    <Text style={styles.text}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {},
});

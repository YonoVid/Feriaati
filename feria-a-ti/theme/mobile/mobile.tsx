import React from 'react';
import { Text, StyleSheet } from 'react-native';

export type MobileProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function Mobile({ text }: MobileProps) {
  return (
    <Text style={styles.text}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {},
});

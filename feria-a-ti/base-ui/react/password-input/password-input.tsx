import React, { ReactNode } from 'react';

export type PasswordInputProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function PasswordInput({ children }: PasswordInputProps) {
  return (
    <div>
      {children}
    </div>
  );
}

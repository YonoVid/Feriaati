import React, { ReactNode } from 'react';

export type MailInputProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function MailInput({ children }: MailInputProps) {
  return (
    <div>
      {children}
    </div>
  );
}

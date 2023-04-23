import React, { ReactNode } from 'react';

export type WebProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function Web({ children }: WebProps) {
  return (
    <div>
      {children}
    </div>
  );
}

import React from 'react';

export type InjectComponent = {
  name: string,
  path: string,
  label: string,
  Component: React.ComponentType<{}>
};

'use client';

import {
  HydrationBoundary as RQHydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  state?: ReturnType<typeof dehydrate>;
}

export function HydrationBoundary({ children, state }: Props) {
  if (!state) return <>{children}</>;

  return <RQHydrationBoundary state={state}>{children}</RQHydrationBoundary>;
}

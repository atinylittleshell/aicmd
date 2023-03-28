'use client';

import { PropsWithChildren } from 'react';

import { FirebaseContextProvider } from '../../hooks/FirebaseContext';

export default function ClientSideProviders(props: PropsWithChildren) {
  return <FirebaseContextProvider>{props.children}</FirebaseContextProvider>;
}

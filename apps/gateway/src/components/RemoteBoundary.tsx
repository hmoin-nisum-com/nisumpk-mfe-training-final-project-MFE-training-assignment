import React, { Suspense, useState } from 'react';
import { ErrorBoundary, Loader } from '@ecommerce/shared-ui';

export interface RemoteBoundaryProps {
  children: React.ReactNode;
  remoteName: string;
  expectedUrl: string;
}

export const RemoteBoundary: React.FC<RemoteBoundaryProps> = ({
  children,
  remoteName,
  expectedUrl
}) => {
  const [remountKey, setRemountKey] = useState(0);

  return (
    <ErrorBoundary
      key={remountKey}
      onReset={() => setRemountKey((prev) => prev + 1)}
      fallbackTitle={`Unable to load Remote Micro Frontend: ${remoteName}`}
      fallbackMessage={`The host gateway could not establish connection with remote '${remoteName}' at ${expectedUrl}. Ensure the remote server is running.`}
    >
      <Suspense fallback={<Loader label={`Loading ${remoteName} via Module Federation...`} size="lg" />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

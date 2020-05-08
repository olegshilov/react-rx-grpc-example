import React, { ReactElement, createContext, useContext, useMemo } from 'react';
import { useEchoGrpcClient, EchoGprcClient } from './EchoGrpcClient';
import { Observable } from 'rxjs';

export type EchoService = {
  echo: (text: string) => Observable<string>;
  echoStream: (text: string) => Observable<string>;
};

export const EchoServiceContext = createContext<EchoService | void>(undefined);

export function createEchoService(client: EchoGprcClient): EchoService {
  return {
    echo: (text: string): Observable<string> => client.echo(text),
    echoStream: (text: string): Observable<string> => client.echoStream(text),
  };
}

export function EchoService({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const echoGprcClient = useEchoGrpcClient();
  const echoService = useMemo(() => createEchoService(echoGprcClient), [
    echoGprcClient,
  ]);

  return (
    <EchoServiceContext.Provider value={echoService}>
      {children}
    </EchoServiceContext.Provider>
  );
}

export function useEchoService(): EchoService {
  const service = useContext(EchoServiceContext);

  if (!service) {
    throw new Error(
      'useEchoService() should be used inside EchoServiceContext'
    );
  }

  return service;
}

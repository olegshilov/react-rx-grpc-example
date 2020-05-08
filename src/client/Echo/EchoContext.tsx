import React, { ReactElement } from 'react';
import { EchoService } from './EchoService';
import { EchoFacade } from './EchoFacade';

export function EchoContext({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  return (
    <EchoService>
      <EchoFacade>{children}</EchoFacade>
    </EchoService>
  );
}

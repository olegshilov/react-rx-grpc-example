import React, { ReactElement } from 'react';
import { useEchoState, useEchoActions } from './EchoFacade';

export function Echo(): ReactElement {
  const { epic, grpc } = useEchoState();
  const {
    ping,
    pingStream,
    pingStop,
    grpcEcho,
    grpcEchoStream,
    grpcEchoStop,
  } = useEchoActions();

  return (
    <div>
      <h1>React RxJS gRPC example</h1>

      <h3>Epics</h3>
      <p>
        current state: <b>{epic}</b>
      </p>
      <button onClick={ping}>ping</button>
      <button onClick={pingStream}>pingStream</button>
      <button onClick={pingStop}>pingStop</button>

      <h3>gRPC</h3>
      <p>
        current state: <b>{grpc}</b>
      </p>
      <button onClick={grpcEcho}>grpcEcho</button>
      <button onClick={grpcEchoStream}>grpcEchoStream</button>
      <button onClick={grpcEchoStop}>grpcEchoStop</button>
    </div>
  );
}

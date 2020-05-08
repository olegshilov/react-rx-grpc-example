import React, { ReactElement } from 'react';
import { render } from 'react-dom';
import { Echo, EchoContext } from './Echo';

function Root(): ReactElement {
  return (
    <EchoContext>
      <Echo />
    </EchoContext>
  );
}

function createApp(): void {
  const container = document.getElementById('root');

  render(<Root />, container);
}

createApp();

import { useState } from 'react';
import { ConnectPage } from '@/pages/connect/ConnectPage';
import { MessengerPage } from '@/pages/messenger/MessengerPage';
import type { GreenApiConnection } from '@/shared/api/types';

function App() {
  const [connection, setConnection] =
    useState<GreenApiConnection | null>(null);

  return connection ? (
    <MessengerPage
      connection={connection}
      onLogout={() => setConnection(null)}
    />
  ) : (
    <ConnectPage onConnected={setConnection} />
  );
}

export default App;
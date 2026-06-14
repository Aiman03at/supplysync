import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// Singleton: one shared connection for the entire app lifetime.
// Calling io() multiple times would open duplicate WebSocket connections
// and cause every event handler to fire multiple times.
const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;

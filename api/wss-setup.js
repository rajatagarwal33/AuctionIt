// config/wss-setup.js
import http from 'http';
import { WebSocketServer } from 'ws';

export const setupWebSocket = (app) => {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  // WebSocket setup
  wss.on('connection', (ws) => {
    
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });
    console.log("ws conected")
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));
  });

  return { server, wss };
};

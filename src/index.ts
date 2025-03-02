import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import { webSocketManager } from './utils/websocket';

import authRoutes from './routes/authRoutes';
import followRoutes from './routes/followRoutes';
import blockRoutes from './routes/blockRoutes';
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 5050;

wss.on('connection', (ws: WebSocket) => {
  console.log('[WebSocket] New connection established');

  ws.on('message', (message: Buffer) => {
    try {
      const messageStr = message.toString();
      console.log(`[WebSocket] Received message: ${messageStr}`);

      const data = JSON.parse(messageStr);

      if (data.type === 'register' && data.userId) {
        console.log(`[WebSocket] Registering client: ${data.userId}`);
        webSocketManager.registerClient(data.userId, ws);
        webSocketManager.dumpClientIds(); // 打印所有已註冊的客戶端

        // 發送確認消息回客戶端
        ws.send(
          JSON.stringify({
            type: 'registerConfirmation',
            userId: data.userId,
            success: true,
          })
        );
      }

      // 檢查用戶的WebSocket連接狀態
      if (data.type === 'checkConnection' && data.userId) {
        const isConnected = webSocketManager.checkClientConnection(data.userId);
        ws.send(
          JSON.stringify({
            type: 'connectionStatus',
            userId: data.userId,
            isConnected,
          })
        );
      }
    } catch (error) {
      console.error('[WebSocket] Error processing message:', error);
    }
  });

  ws.on('close', () => {
    // 找到並刪除關閉的連接
    webSocketManager.findAndRemoveClient(ws);
  });
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/block', blockRoutes);

server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
});

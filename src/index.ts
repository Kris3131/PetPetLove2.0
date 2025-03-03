import cors from 'cors';
import { config } from 'dotenv';
import express, { json } from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import { WebSocket, WebSocketServer } from 'ws';

import connectDB from './config/db';
import { requestLogger } from './middleware/loggerMiddleware';
import { responseMiddleware } from './middleware/responseMiddleware';
import authRoutes from './routes/authRoutes';
import blockRoutes from './routes/blockRoutes';
import followRoutes from './routes/followRoutes';
import logger from './utils/logger';
import { webSocketManager } from './utils/websocket';

config();

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
        webSocketManager.dumpClientIds();

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
      console.error(`[WebSocket] Error processing message: ${error}`);
    }
  });

  ws.on('close', () => {
    // 找到並刪除關閉的連接
    webSocketManager.findAndRemoveClient(ws);
  });
});

app.use(json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(requestLogger);
app.use(responseMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/block', blockRoutes);

server.listen(PORT, async () => {
  try {
    await connectDB();
    logger.info(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    logger.error(`[DB]Failed to connect to MongoDB: ${error}`);
  }
});

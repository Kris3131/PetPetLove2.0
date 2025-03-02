import { Request, RequestHandler,Response  } from 'express';
import { WebSocket } from 'ws';

import Follow from '../models/Follow';
import Notification from '../models/Notification';
import { webSocketManager } from '../utils/websocket';

export const followUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    console.log(
      `[Follow] Processing follow request: ${followerId} -> ${userId}`
    );

    // 檢查 userId 是否與 WebSocket 註冊的一致
    console.log(
      `[Follow] Connected clients: ${
        webSocketManager.getConnectedClientIds?.() || 'method not available'
      }`
    );
    const ws = webSocketManager.getClient(userId);
    console.log(`[Follow] Found WebSocket for ${userId}: ${!!ws}`);

    if (userId === followerId) {
      res.status(400).json({ message: '[follow] Cannot follow yourself' });
      return;
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId,
    });

    if (existingFollow) {
      res.status(400).json({ message: '[follow] Already followed' });
      return;
    }

    await Follow.create({ follower: followerId, following: userId });
    const notification = await Notification.create({
      receiver: userId,
      initiator: followerId,
      type: 'follow',
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'follow',
          message: `You have a new follower: ${followerId}`,
          notification,
        })
      );
    }
    res.status(201).json({ message: '[follow] Successfully followed' });
  } catch (error) {
    res.status(500).json({ message: '[follow] Server error' });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId,
    });
    if (!existingFollow) {
      res.status(400).json({ message: '[follow] Not following' });
      return;
    }

    await Follow.deleteOne({ follower: followerId, following: userId });

    res.status(200).json({ message: '[follow] Successfully unfollowed' });
    return;
  } catch (error) {
    res.status(500).json({ message: '[follow] Server error' });
    return;
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ following: userId }).populate(
      'follower',
      'username'
    );
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: '[follow] Server error' });
  }
};

// 取得某用戶的關注清單
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ follower: userId }).populate(
      'following',
      'username'
    );
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: '[follow] Server error' });
  }
};

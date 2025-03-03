import { RequestHandler } from 'express';
import { WebSocket } from 'ws';

import { HTTP_STATUS } from '../constants/httpStatus';
import Follow from '../models/Follow';
import Notification from '../models/Notification';
import logger from '../utils/logger';
import { errorResponse, successResponse } from '../utils/response';
import { webSocketManager } from '../utils/websocket';

export const followUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    logger.info(
      `[FOLLOW] Processing follow request: ${followerId} -> ${userId}`
    );

    // 檢查 userId 是否與 WebSocket 註冊的一致
    logger.info(
      `[FOLLOW] Connected clients: ${
        webSocketManager.getConnectedClientIds?.() || 'method not available'
      }`
    );
    const ws = webSocketManager.getClient(userId);
    logger.info(`[FOLLOW] Found WebSocket for ${userId}: ${!!ws}`);

    if (userId === followerId) {
      logger.error(
        `[FOLLOW] Cannot follow yourself: ${followerId} -> ${userId}`
      );
      errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Cannot follow yourself');
      return;
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId,
    });

    if (existingFollow) {
      logger.error(`[FOLLOW] Already followed: ${followerId} -> ${userId}`);
      errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Already followed');
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
    successResponse(res, HTTP_STATUS.CREATED, 'Successfully followed');
  } catch (error) {
    logger.error(`[FOLLOW] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const unfollowUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId,
    });
    if (!existingFollow) {
      logger.error(`[FOLLOW] Not following: ${followerId} -> ${userId}`);
      errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Not following');
      return;
    }

    await Follow.deleteOne({ follower: followerId, following: userId });

    successResponse(res, HTTP_STATUS.OK, 'Successfully unfollowed');
  } catch (error) {
    logger.error(`[FOLLOW] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getFollowers: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ following: userId }).populate(
      'follower',
      'username'
    );
    successResponse(res, HTTP_STATUS.OK, 'Followers', followers);
  } catch (error) {
    logger.error(`[FOLLOW] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const getFollowing: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ follower: userId }).populate(
      'following',
      'username'
    );
    successResponse(res, HTTP_STATUS.OK, 'Following', following);
  } catch (error) {
    logger.error(`[FOLLOW] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

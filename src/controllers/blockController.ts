import { RequestHandler } from 'express';

import { HTTP_STATUS } from '../constants/httpStatus';
import Block from '../models/Block';
import logger from '../utils/logger';
import { errorResponse, successResponse } from '../utils/response';

export const blockUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    if (userId === blockerId) {
      logger.error(`[BLOCK] Cannot block yourself: ${blockerId} -> ${userId}`);
      errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'You cannot block yourself');
    }

    const existingBlock = await Block.findOne({
      blocker: blockerId,
      blocked: userId,
    });
    if (existingBlock) {
      logger.error(
        `[BLOCK] You have already blocked this user: ${blockerId} -> ${userId}`
      );
      errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'You have already blocked this user'
      );
    }

    await Block.create({ blocker: blockerId, blocked: userId });
    logger.info(
      `[BLOCK] Successfully blocked the user: ${blockerId} -> ${userId}`
    );
    successResponse(res, HTTP_STATUS.CREATED, 'Successfully blocked the user');
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
    return;
  }
};

export const unblockUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    const existingBlock = await Block.findOne({
      blocker: blockerId,
      blocked: userId,
    });
    if (!existingBlock) {
      logger.error(
        `[BLOCK] This user is not blocked: ${blockerId} -> ${userId}`
      );
      errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'This user is not blocked');
    }

    await Block.deleteOne({ blocker: blockerId, blocked: userId });
    logger.info(
      `[BLOCK] Successfully unblocked the user: ${blockerId} -> ${userId}`
    );
    successResponse(res, HTTP_STATUS.OK, 'Successfully unblocked the user');
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
    return;
  }
};

export const getBlockedUsers: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const blockerId = req.user.id;
    const blockedUsers = await Block.find({ blocker: blockerId }).populate(
      'blocked',
      'username avatar'
    );
    logger.info(`[BLOCK] Blocked users: ${blockedUsers}`);
    successResponse(res, HTTP_STATUS.OK, 'Blocked users', blockedUsers);
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
    return;
  }
};

export const isBlocked: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    const block = await Block.findOne({ blocker: blockerId, blocked: userId });
    logger.info(`[BLOCK] Is blocked: ${blockerId} -> ${userId} ${!!block}`);
    successResponse(res, HTTP_STATUS.OK, 'Is blocked', {
      blocked: !!block,
    });
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
    return;
  }
};

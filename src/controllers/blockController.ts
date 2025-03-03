import { Request, RequestHandler, Response } from 'express';

import Block from '../models/Block';
import logger from '../utils/logger';

export const blockUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    if (userId === blockerId) {
      logger.error(`[BLOCK] Cannot block yourself: ${blockerId} -> ${userId}`);
      res.status(400).json({ message: '[Block] You cannot block yourself' });
      return;
    }

    const existingBlock = await Block.findOne({
      blocker: blockerId,
      blocked: userId,
    });
    if (existingBlock) {
      logger.error(
        `[BLOCK] You have already blocked this user: ${blockerId} -> ${userId}`
      );
      res
        .status(400)
        .json({ message: '[BLOCK] You have already blocked this user' });
      return;
    }

    await Block.create({ blocker: blockerId, blocked: userId });
    logger.info(
      `[BLOCK] Successfully blocked the user: ${blockerId} -> ${userId}`
    );
    res.status(201).json({ message: '[BLOCK] Successfully blocked the user' });
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    res.status(500).json({ message: `[BLOCK] ${error}` });
  }
};

export const unblockUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
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
      res.status(400).json({ message: '[BLOCK] This user is not blocked' });
      return;
    }

    await Block.deleteOne({ blocker: blockerId, blocked: userId });
    logger.info(
      `[BLOCK] Successfully unblocked the user: ${blockerId} -> ${userId}`
    );
    res
      .status(200)
      .json({ message: '[BLOCK] Successfully unblocked the user' });
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    res.status(500).json({ message: `[BLOCK] ${error}` });
  }
};

export const getBlockedUsers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const blockerId = req.user.id;
    const blockedUsers = await Block.find({ blocker: blockerId }).populate(
      'blocked',
      'username avatar'
    );
    logger.info(`[BLOCK] Blocked users: ${blockedUsers}`);
    res.json(blockedUsers);
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    res.status(500).json({ message: `[BLOCK] ${error}` });
  }
};

export const isBlocked: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    const block = await Block.findOne({ blocker: blockerId, blocked: userId });
    logger.info(`[BLOCK] Is blocked: ${blockerId} -> ${userId} ${!!block}`);
    res.json({ blocked: !!block });
  } catch (error) {
    logger.error(`[BLOCK] Server error: ${error}`);
    res.status(500).json({ message: `[BLOCK] ${error}` });
  }
};

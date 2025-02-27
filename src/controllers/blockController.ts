import { Request, Response } from 'express';
import Block from '../models/Block';

import { RequestHandler } from 'express';

export const blockUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    if (userId === blockerId) {
      res.status(400).json({ message: '[Block] You cannot block yourself' });
      return;
    }

    const existingBlock = await Block.findOne({
      blocker: blockerId,
      blocked: userId,
    });
    if (existingBlock) {
      res
        .status(400)
        .json({ message: '[Block] You have already blocked this user' });
      return;
    }

    await Block.create({ blocker: blockerId, blocked: userId });
    res.status(201).json({ message: '[Block] Successfully blocked the user' });
  } catch (error) {
    res.status(500).json({ message: '[Block] Server error' });
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
      res.status(400).json({ message: '[Block] This user is not blocked' });
      return;
    }

    await Block.deleteOne({ blocker: blockerId, blocked: userId });
    res
      .status(200)
      .json({ message: '[Block] Successfully unblocked the user' });
  } catch (error) {
    res.status(500).json({ message: '[Block] Server error' });
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
    res.json(blockedUsers);
  } catch (error) {
    res.status(500).json({ message: '[Block] Server error' });
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
    res.json({ blocked: !!block });
  } catch (error) {
    res.status(500).json({ message: '[Block] Server error' });
  }
};

import { Request, Response } from 'express';
import Follow from '../models/Follow';
import { RequestHandler } from 'express';

export const followUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

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
    res.status(201).json({ message: '[follow] Successfully followed' });
    return;
  } catch (error) {
    res.status(500).json({ message: '[follow] Server error' });
    return;
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
      'username avatar'
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
      'username avatar'
    );
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: '[follow] Server error' });
  }
};

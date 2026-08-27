import { Request, Response } from 'express';
import { UserService } from '../../application/user.service.js';
import { prisma } from '../db/prisma.client.js';

const userService = new UserService(prisma);

export class UserController {
  static async getUsers(_req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching users', error });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching user', error });
    }
  }
}
import mongoose from 'mongoose';
import userService from '../services/UserService.js';

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const user = await userService.getById(id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userService.getById(req.userId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req, res, next) {
    try {
      const user = await userService.updateProfile(req.userId, req.body);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();

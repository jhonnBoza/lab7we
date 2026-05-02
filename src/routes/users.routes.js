import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/me', authenticate, authorize([]), UserController.getMe);
router.patch('/me', authenticate, authorize([]), UserController.updateMe);

router.get('/', authenticate, authorize(['admin']), UserController.getAll);
router.get('/:id', authenticate, authorize(['admin']), UserController.getOne);

export default router;

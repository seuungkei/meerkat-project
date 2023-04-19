import express from 'express';

import { userController } from '../controllers/userController';
import { userService } from '../services/userService';
import { userRepository } from '../repositories/userRepository';

const router = express.Router();

const getUserDataController = new userController(new userService(new userRepository()));

router.post('/signup', getUserDataController.signUp);

export { router as userRouter };

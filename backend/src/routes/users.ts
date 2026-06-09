import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, managerOnly } from '../middleware/auth';
import { validateUserQuery, validateUserId } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Manager only routes
router.get('/', managerOnly, validateUserQuery, UserController.getAllUsers);
router.get('/stats', managerOnly, UserController.getUserStats);
router.get('/search', managerOnly, UserController.searchUsers);
router.get('/:id', managerOnly, validateUserId, UserController.getUserById);

export default router;

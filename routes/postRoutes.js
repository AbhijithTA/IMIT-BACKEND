import express from 'express';
import { createPost, getPosts, likePost, commentPost } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/', authMiddleware,upload.single('image'), createPost);
router.get('/', authMiddleware, getPosts);
router.post('/:postId/like', authMiddleware, likePost);
router.post('/:postId/comment', authMiddleware, commentPost);

export default router;

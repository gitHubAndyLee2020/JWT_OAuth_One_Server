import { Router } from 'express'
import { getPosts, createPost, deletePost, updatePost, likePost } from '../controllers/postControllers.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', getPosts)
router.post('/', authMiddleware, createPost)
router.delete('/:id', authMiddleware, deletePost)
router.patch('/:id', authMiddleware, updatePost)
router.patch('/:id/likePost', authMiddleware, likePost)

export default router

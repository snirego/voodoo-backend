import express from 'express'
import users from './users'
const router = express.Router();

// Use the usersRouter for the '/users' route
router.use('/users', users)

export default router

import express from 'express'
import Users from '../models/Users'
const router = express.Router();
import verifyToken from '../middleware/verifyToken'

// Route to get all users (protected by verifyToken middleware)
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const users = await Users.find()

    res.send({
      message: 'All users',
      data: users
    })
  } catch (e) {
    next(e)
  }
})

// Route to register a new user
router.post('/register', async (req, res, next) => {
  try {
    const credentials = req.body
    const user = new Users(credentials)
    await user.save()

    res.send({
      message: 'User Registered Successfully!'
    })
  } catch (e) {
    next(e)
  }
})

// Route to handle user login
router.post('/login', async (req, res, next) => {
  try {
    //Step 1: Check if email exists in database
    const { email, password } = req.body

    const user = await Users.findOne({ $or: [{ email }, { username: email }] });

    if (!user) {
      next({ message: "User doesn't exist" })
      return
    }

    //Step 2: Compare passwords

    const isPasswordCorrect = user.comparePassword(password)

    if (!isPasswordCorrect) {
      next({ message: "Invalid Password" })
      return
    }

    //Step 3: Generate Token!
    const token = user.generateToken()
    await user.save()

    res.send({
      message: 'Logged in successfully',
      token
    })
  } catch (e) {
    next(e)
  }
  
})

// Route to handle user logout
router.post('/logout', verifyToken, async(req, res, next) => {
  try {
    const token = req.headers.authorization.slice(7)

    await Users.findOneAndUpdate({ _id: req.decoded._id }, { $pull: { tokens: token } })
    res.send({
      message: 'Logged out successfully!'
    })
  } catch (e) {
    next(e)
  }
})

// Add an error-handling middleware to handle thrown errors
router.use((err, req, res, next) => {
  res.status(500).send({
    message: 'Internal Server Error',
    error: err.message,
  });
})

export default router

import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/environment'

const Schema = mongoose.Schema

// Define the structure of the Users collection
const UsersSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Custom validator to check if the username contains spaces
        return !/\s/.test(value);
      },
      message: 'Username must not contain spaces'
    }
  },
  tokens: {
    type: Array,
    default: []
  }
})

// Middleware: This function runs before saving a user to the database
UsersSchema.pre("save", function (next) {
  const user = this

  if (user.isModified('password')) {
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(user.password, salt)

    user.password = hash
  }

  next()
})

// Method: Compare the provided password with the user's hashed password
UsersSchema.methods.comparePassword = function (password) {
  const user = this

  return bcryptjs.compareSync(password, user.password)
}

// Method: Generate and return a JWT token for the user
UsersSchema.methods.generateToken = function () {
  const user = this

  const token = jwt.sign({ _id: user._id }, SECRET_KEY)
  user.tokens.push(token)
  return token
}

// Ensure that unique indexes are created for email and username
UsersSchema.index({ email: 1 }, { unique: true })
UsersSchema.index({ username: 1 }, { unique: true })

// Create a Mongoose model for the Users collection
const Users = mongoose.model('users', UsersSchema)

export default Users

import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/environment'

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.slice(7)
    const decoded = jwt.verify(token, SECRET_KEY)
    req.decoded = decoded

    next()
  } catch (e) {
    res.status(500).send({
      message: 'Internal Server Error',
      error: 'You need to login in order to use this API'
    })
  }
}

export default verifyToken

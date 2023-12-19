import mongoose from 'mongoose'
import { DB_URL } from './environment'

const mongoURI = DB_URL

mongoose.connect(mongoURI)

export default mongoose
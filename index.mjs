import express from 'express';
import cors from 'cors';
import db from './config/db';
import { PORT } from './config/environment';
import routes from './routes';

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Connect to the database
db.connection.once('open', () => {
  console.log('db connected successfully');

  // Start the server after the database connection is established
  app.listen(PORT || 3001, () => {
    console.log(`Listening to ${PORT || 3001}`);
  });
}).on('error', (e) => {
  console.log('error: ', e);
});

// Use your routes
app.use('/', routes)
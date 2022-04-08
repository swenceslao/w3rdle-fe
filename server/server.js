import express from 'express';
import cors from 'cors';
import words from './words.js';

const app = express();
app.use(cors());
const port = process.env.PORT || 5001;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/health', (_, res) => {
  res.send({ status: 'UP' });
});

app.get('/random', (_, res) => {
  const random = Math.floor(Math.random() * words.length);
  const currentWord = words[random].toUpperCase();
  res.send({ currentWord });
});

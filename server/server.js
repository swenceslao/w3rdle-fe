import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import words from './words.js';

const app = express();
app.use(cors());
const port = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/health', (_, res) => {
  res.send({ status: 'UP' });
});

app.get('/random_word', (_, res) => {
  const random = Math.floor(Math.random() * words.length);
  const currentWord = words[random].toUpperCase();
  res.send({ currentWord });
});

app.post('/minted', (req, res) => {
  console.log(req.body);
  res.send({
    status: 200,
    data: 'OK',
  });
  // res.status(400);
  // res.send({
  //   status: 400,
  //   error: 'Wallet unauthorized || Exclusivity expired',
  // });
});

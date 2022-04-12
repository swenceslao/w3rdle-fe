import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import CryptoJS from 'crypto-js';
import words from './words.js';

const encryptWithAES = (text) => {
  const passphrase = process.env.PASSPHRASE;
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const app = express();
app.use(cors());
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/health', (_, res) => {
  res.send({ status: 'UP' });
});

app.get('/random_word', (_, res) => {
  const random = Math.floor(Math.random() * words.length);
  const currentWord = encryptWithAES(words[random].toUpperCase());
  res.send({ currentWord });
});

app.post('/minted', (req, res) => {
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

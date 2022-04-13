import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import CryptoJS from 'crypto-js';
import words from './words.js';

const encryptWithAES = (text, passphrase) => CryptoJS.AES.encrypt(text, passphrase).toString();
const decryptWithAES = (ciphertext, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

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
  const currentWord = encryptWithAES(words[random].toUpperCase(), process.env.RANDOM_WORD_PASSPHRASE);
  res.send({ currentWord });
});

app.post('/minted', (req, res) => {
  const { body: { data: requestData } } = req;
  const data = decryptWithAES(requestData, process.env.MINTED_PASSPHRASE);
  const parsed = data ? JSON.parse(data) : '';
  if (parsed && parsed.word && parsed.word.length === 5) {
    // pass to microservice and send a success response to client
    res.send({
      status: 200,
      data: 'OK',
    });
  } else {
    res.status(400);
    res.send({
      status: 400,
      error: 'Wallet unauthorized || Exclusivity expired',
    });
  }
});

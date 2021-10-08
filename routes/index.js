import { AppController } from '../controllers/AppController';

const express = require('express');
const app = require('express');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

app.get('/', (req, res) => {
  res.send('key: value');
});

module.exports = app;

const express = require('express');

const redisClient = require('./utils/redis');

const dbClient = require('./utils/db');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('key: value');
});

app.get('/status', (req, res) => {
  if (redisClient.isAlive() && dbClient.isAlive()) {
    res.status(200).json({ redis: true, db: true }, 200);
  }
});

app.get('/stats', async (req, res) => {
  const users = await dbClient.nbUsers();
  const files = await dbClient.nbFiles();
  const obj = {
    users,
    files,
  };
  res.status(200).send(obj);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  const nusers = async () => (console.log(await dbClient.nbUsers()));
  const nfiles = async () => (console.log(await dbClient.nbFiles()));
  console.log(nusers(), nfiles());
});

export default app;

const express = require('express');
const DBClient = require('../utils/db');

const RedisClient = require('../utils/redis');

const AppController = express.Router();

AppController.getStatus('/status', (req, res) => {
  if (RedisClient.isAlive() && DBClient.isAlive()) {
    res.res('{ "redis": true, "db": true }', 200);
  }
});

const nusers = async () => { await DBClient.nbUsers(); };
const nfiles = async () => { await DBClient.nbFiles(); };

AppController.getStats('/stats', (req, res) => {
  const obj = {
    users: nusers,
    files: nfiles,
  };
  res.send(obj, 200);
});

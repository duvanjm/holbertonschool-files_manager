import { MongoClient } from 'mongodb';

const mongoose = require('mongoose');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.client = false; 
  }

  isAlive() {
   this.client = mongoose.connect(`mongodb://${this.host}:${this.port}/${this.database}`);
    if (this.client) {
      return true;
    }
    return false;
  }

  nbUsers() {
    const count = mongoose.model('users', {});
    const user = count.find();
    user.count(function (err, count) {
    if (err) console.log(err)
    else return count;
  });
    return count;
  }

  nbFiles() {
    const count = mongoose.model('files', {});
    const user = count.find();
    user.count(function (err, count) {
    if (err) console.log(err)
    else return count;
  });
    return count;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

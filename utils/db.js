const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

class DBClient {
  constructor() {
      const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
      const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
      const db = process.env.DB_DATABASE ? process.env.DB_DATABASE : 'files_manager';
      const url = `mongodb://${host}:${port}/${db}`;
      const newUrl = 'mongodb://localhost:27017/files_manager';

      this.client = new MongoClient(newUrl, { useUnifiedTopology: true });
      this.client.connect();
  }

  isAlive() {
    if (this.client.isConnected()) {
      return true
    } 
    return false;
  }
}

const dbClient = new DBClient();

module.exports = dbClient;


// const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
// const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
// const db = process.env.DB_DATABASE ? process.env.DB_DATABASE : 'files_manager';
// const url = `mongodb://${host}:${port}/${db}`;
// const newUrl = 'mongodb://localhost:27017/files_manager';
// const client = new MongoClient(url, { useUnifiedTopology: true });

// // Database Name
// const dbName = 'myProject';

// async function main() {
//   // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
//   const collection = db.collection('documents');

//   // the following code examples can be pasted here...

//   return 'done.';
// }

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());

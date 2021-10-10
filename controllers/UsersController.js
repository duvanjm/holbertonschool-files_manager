const dbClient = require('../utils/db');

const crypto = require('crypto');

function hashPasswd(password) {
  const hash = crypto.createHash('sha1');
  const data = hash.update(password, 'utf-8');
  //Creating the hash in the required format
  const genHash = data.digest('hex');
  return genHash;
}

class UsersController {
  static postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    const search = dbClient.db.collection('users').find({'email': email}).toString();
    if (!email) {
      res.status(400).json({error: 'Missing email'});
    } if (!password) {
      res.status(400).json({error: 'Missing password'});
    } if (search.length === 0 || !search) {
      res.status(400).json({error: 'Already exist'});
    }
    const hashpwd = hashPasswd(password);
    dbClient.db.collection('users').insertOne({email: email, password: hashpwd});
    res.status(200).json(search);
  }
}

module.exports = UsersController;


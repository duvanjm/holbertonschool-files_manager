const crypto = require('crypto');
const dbClient = require('../utils/db');

function hashPasswd(password) {
  const hash = crypto.createHash('sha1');
  const data = hash.update(password, 'utf-8');
  // Creating the hash in the required format
  const genHash = data.digest('hex');
  return genHash;
}

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    const search = await dbClient.db.collection('users').find({ email }).toArray();
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    } if (!password) {
      res.status(400).json({ error: 'Missing password' });
    } if (search.length > 0) {
      res.status(400).json({ error: 'Already exist' });
    }
    const hashpwd = hashPasswd(password);
    const addUser = await dbClient.db.collection('users').insertOne({ email, password: hashpwd });
    const newUser = { id: addUser.ops[0]._id, email: addUser.ops[0].email };
    res.status(200).json(newUser);
  }
}

module.exports = UsersController;

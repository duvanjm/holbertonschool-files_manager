import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
  static async postUpload(req, res) {
    const key = req.header('X-Token');
    const session = await redisClient.get(`auth_${key}`);
    if (!key || key.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (session) {
      const { name } = req.body;
      const { type } = req.body;
      let { parentId } = req.body;
      const { isPublic } = req.body;
      const { data } = req.body;
      const types = ['folder', 'file', 'image'];

      if (!name) {
        return (res.status(400).json({ error: 'Missing name' }));
      } if ((!type) || types.includes(type) === false) {
        return (res.status(400).json({ error: 'Missing type' }));
      }

      if (!data && type !== types[0]) {
        return (res.status(400).json({ error: 'Missing data' }));
      }
      if (!parentId) { parentId = 0; }
      if (parentId !== 0) {
        const search = await dbClient.db.collection('files').find({ _id: ObjectId(parentId) }).toArray();
        if (search.length < 1) {
          return (res.status(400).json({ error: 'Parent not found' }));
        }
        if (types[0] !== search[0].type) {
          return (res.status(400).json({ error: 'Parent is not a folder' }));
        }
      }
      const userId = session;
      if (type === types[0]) {
        const folder = await dbClient.db.collection('files').insertOne({
          name,
          type,
          userId: ObjectId(userId),
          parentId: parentId !== 0 ? ObjectId(parentId) : 0,
          isPublic: isPublic || false,
        });
        return res.status(201).json({
          id: folder.ops[0]._id,
          userId: folder.ops[0].userId,
          name: folder.ops[0].name,
          type: folder.ops[0].type,
          isPublic: folder.ops[0].isPublic,
          parentId: folder.ops[0].parentId,
        });
      }

      const buff = Buffer.from(data, 'base64').toString('utf-8');
      const path = process.env.FOLDER_PATH || '/tmp/files_manager';
      const newFile = uuidv4();

      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      fs.writeFile(`${path}/${newFile}`, buff, (err) => {
        if (err) {
          return (res.status(400).json({ error: err.message }));
        }
        return true;
      });
      const file = await dbClient.db.collection('files').insertOne({
        name,
        type,
        userId: ObjectId(userId),
        parentId: parentId !== 0 ? ObjectId(parentId) : 0,
        isPublic: isPublic || false,
        data,
        localPath: `${path}/${newFile}`,
      });

      return res.status(201).json({
        id: file.ops[0]._id,
        userId: file.ops[0].userId,
        name: file.ops[0].name,
        type: file.ops[0].type,
        isPublic: file.ops[0].isPublic,
        parentId: file.ops[0].parentId,
      });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getShow(req, res) {
    const key = req.header('X-Token');
    const session = await redisClient.get(`auth_${key}`);
    if (!key || key.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (session) {
      const { id } = req.params;
      const search = await dbClient.db.collection('files').find({ _id: ObjectId(id) }).toArray();
      if (!search || search.length < 1 ) {
        return res.status(404).json({ error: 'Not found' });
      }
      return (res.json({
        id: search[0]._id,
	userId: search[0].userId,
	name: search[0].name,
	type: search[0].type,
	isPublic: search[0].isPublic,
	parentId: search[0].parentId,
      }));
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getIndex(req, res) {
    const key = req.header('X-Token');
    const session = await redisClient.get(`auth_${key}`);
    if (!key || key.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (session) {
      let { parentId } = req.query;
      if (!parentId) { parentId = '0'; }
      if (parentId === '0') {
        const search = await dbClient.db.collection('files').find({ parentId: parseInt(parentId, 10) }).toArray();
	if (search) {
          return res.status(200).send(search);
	}
      } else if (parentId !== 0) {
          const search = await dbClient.db.collection('files').find({ parentId: ObjectId(parentId) }).toArray();
          if (search) {
            return res.status(200).send(search);
          }
      }
    }
    return res.status(401).json({ error: 'Unauthorized' });	  
  }
}

module.exports = FilesController;

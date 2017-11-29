const {MongoClient} = require('mongodb');

// 1
const MONGO_URL = 'mongodb://localhost:27017/proj4local';

// 2
module.exports = async () => {
  const db = await MongoClient.connect(MONGO_URL);
  return {
    Restaurants: db.collection('restaurants'),
    RestoTables: db.collection('restotables'),
    Transactions: db.collection('transaction'),
    Users: db.collection('users'),
  };
}

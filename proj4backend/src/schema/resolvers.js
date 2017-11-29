const { find, filter } = require('lodash')

const {ObjectID} = require('mongodb')

const restaurants = [
  {
    id: 1,
    name: "Pizza Express",
    cuisine: "Italian",
    tableQuantity: "10",
    address: "Scotts Square, Unit B1 08/09, 6 Scotts Road, 228209",
    contact: "6538 0083"
  },
  {
    id: 2,
    name: "Din Tai Fung",
    cuisine: "Chinese",
    tableQuantity: "20",
    address: "City Square Mall #01-10, 180 Kitchener Rd, Singapore 208539",
    contact: "6634 2322"
  },
];

module.exports = {
  Query: {
    // allRestaurants: () => restaurants
    allRestaurants: async (root, data, {mongo: {Restaurants}}) => { // 1
      return await Restaurants.find({}).toArray(); // 2
    },
  },
  Mutation: {
    createRestaurant: async (root, data, {mongo: {Restaurants}, user}) => {
        console.log('here', user)
        const newRestaurant = Object.assign({postedById: user && user._id}, data)
        const response = await Restaurants.insert(newRestaurant);
        return Object.assign({id: response.insertedIds[0]}, newRestaurant);
    },

    createRestoTable: async (root, data, {mongo: {RestoTables}, user}) => {
       const newRestoTable = Object.assign({orderedById: user && user._id}, data)
       const response = await RestoTables.insert(newRestoTable);
       return Object.assign({id: response.insertedIds[0]}, newRestoTable);
   },

   createTransaction: async (root, data, {mongo: {Transactions}, user}) => {
      const newTransaction = {
        userId: user && user._id,
        restotableId: new ObjectID(data.restotableId),
      };
      const response = await Transactions.insert(newTransaction);
      return Object.assign({id: response.insertedIds[0]}, newTransaction);
    },


    createUser: async (root, data, {mongo: {Users}}) => {
      const newUser = {
        name: data.name,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password,
      };
      const response = await Users.insert(newUser);
      return Object.assign({id: response.insertedIds[0]}, newUser);

    },

    signinUser: async (root, data, {mongo: {Users}}) => {
      const user = await Users.findOne({email: data.email.email});
      if (data.email.password === user.password) {
        return {token: `token-${user.email}`, user};
      }
    },
  },

  User: {
  // Convert the "_id" field from MongoDB to "id" from the schema.
  id: root => root._id || root.id,
 },

  Restaurant: {
   id: root => root._id || root.id, // 5

   postedBy: async ({postedById}, data, {mongo: {Users}}) => {
     console.log('postedById', postedById);
     return await Users.findOne({id: postedById});
   },
 },

 RestoTable: {
  id: root => root._id || root.id,

  orderedBy: async ({orderedById}, data, {mongo: {Users}}) => {
        return await Users.findOne({id: orderedById});
    },

  transactions: async ({_id}, data, {mongo: {Transactions}}) => {
        return await Transactions.find({restotableId: _id}).toArray();
    },

 },

 Transaction: {
  id: root => root._id || root.id,

  user: async ({userId}, data, {mongo: {Users}}) => {
    return await Users.findOne({_id: userId});
  },

  restotable: async ({restotableId}, data, {mongo: {RestoTables}}) => {
    return await RestoTables.findOne({_id: restotableId});
  },
},

};

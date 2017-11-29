const {makeExecutableSchema} = require('graphql-tools')
const resolvers = require('./resolvers')

// Define your types here.
const typeDefs = `
  type Restaurant {
    id: ID!
    name: String!
    cuisine: String!
    tableQuantity: String!
    address: String!
    contact: String!
    postedBy: User
  }

  type RestoTable {
    id: ID!
    tableNumber: String!
    dishes: String!
    status: String!
    orderedBy: User
    transactions: [Transaction!]!
  }

  type Transaction {
    id: ID!
    user: User!
    restotable: RestoTable!
  }

  type Query {
    allRestaurants: [Restaurant!]!

    allRestoTables: [RestoTable!]!
  }

  type Mutation {
    createRestaurant(name: String!, cuisine: String!,
      tableQuantity: String!, address: String!, contact: String!): Restaurant

    createRestoTable(tableNumber: String!, dishes: String!,
      status: String!): RestoTable

    createTransaction(restotableId: ID!): Transaction

    createUser(name: String!, authProvider: AuthProviderSignupData!): User

    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  }

  type SigninPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    name: String!
    email: String
  }

  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }
`

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({typeDefs, resolvers})

const express = require('express')

// This package automatically parses JSON requests.
const bodyParser = require('body-parser')

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
const {graphqlExpress,  graphiqlExpress} = require('apollo-server-express')

const cors = require('cors')

const schema = require('./schema')

// 1
const connectMongo = require('./mongo-connector');

const {authenticate} = require('./authentication');

// 2
const start = async () => {
  // 3
  const mongo = await connectMongo();
  var app = express();
  app.use(cors())

  app.use('/graphql', bodyParser.json(), graphqlExpress({
    context: {mongo}, // 4
    schema
  }));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-yuki@admin.com'`,
  }));

  const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
      context: {mongo, user}, // This context object is passed to all resolvers.
      schema,
    };
  };
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`OmniApp GraphQL server running on port ${PORT}.`)
  });
};

// 5
start();

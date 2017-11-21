const express = require('express')
const app = express()

app.get('/', function(req, res) {
  res.send('testing landing page')
});

app.listen(3000)

const exphbs = require("express-handlebars")
const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const passport = require("./config/ppConfig")
const methodOverride = require('method-override')
const flash = require("connect-flash")
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
require("dotenv").config({silent: true})


// handlebar helpers
var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers      : {

      checkAdmin: function(first, second, options) {
        console.log(first, second);

        if (String(first) === String(second)) {
          return options.fn(this)
        }
      },
      times: function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
}
    }
})

// stripe payment
const stripe = require('stripe')('sk_test_Mjeo02fveFmPGmRNRWUiLN1j') // secret key must be in .env file

app.post('/charge', function(req, res) {
  stripe.customers.create({
    email: 'yuki@email.com'
    }).then(function(customer){
    return stripe.customers.createSource(customer.id, {
      source: 'tok_visa'
    })
    }).then(function(source) {
    return stripe.charges.create({
      amount: 10000,
      currency: 'sgd',
      customer: source.customer
    })
  }).then(function(charge) {
    res.send("completed payment!")
  }).catch(function(err) {
    res.send("error!")
  })
})

//======= Set up handlebars
// app.engine('handlebars', exphbs({defaultLayout:'main'}))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'client/build')));

const mongoose = require('mongoose')
const dbUrl =
process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/proj4local'
const port = process.env.PORT || 8000
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/proj4local')
mongoose.connect(dbUrl, {
  useMongoClient: true
})
mongoose.Promise = global.Promise
// ======== Setting up Sessions AFTER connecting to mongoose ===== //
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true, //saves session and stores it in DB
  store: new MongoStore({ mongooseConnection: mongoose.connection }) // store it in MongoDB, this requires mongo-connect to work
}))
// ====== set up flash ======
app.use(flash())
// setup methodOverride
app.use(methodOverride('_method'))
//=== Setup passport
app.use(passport.initialize())
app.use(passport.session())
// ===== Set up bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use((req,res,next)=>{
  app.locals.currentUser = req.user ? req.user : null
  next()
})

//Access models
const Restaurant = require("./models/restaurant")
const Restotable = require("./models/restotable")
const User = require("./models/user")
const Item = require("./models/item")

// allow cors
var cors = require('cors')
app.use(cors())

// load route files
const authentication_routes = require("./routes/authentication_routes")
const display_data_routes = require("./routes/display_data")
const user_routes = require("./routes/user_routes")
const staff_routes = require("./routes/staff_routes")

// set up routes
app.use("/authentication", authentication_routes)
app.use("/display_data", display_data_routes)
app.use("/user",user_routes)
app.use("/staff", staff_routes)




// sockets setup
io.on('connection', (socket) => {
  console.log('===> Socket Connected : ', socket.id)
    socket.on('submitOrder', (message) => {
    console.log('from frontend connection', message)
      io.emit("orderConfirmed",{
        message: "test",
        data: 123123123
      })

    })

    socket.on("foodready", (data)=>{
  io.emit("foodCollect", data)
  })
  // here you can start emitting events to the client
});


// io.listen(port);
server.listen(port)

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
    email: 'testUSD@email.com'
    }).then(function(customer){
    return stripe.customers.createSource(customer.id, {
      source: 'tok_visa'
    })
    }).then(function(source) {
    return stripe.charges.create({
      amount: 1000,
      currency: 'usd',
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

app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/proj4local', {
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

// allow cors
var cors = require('cors')

app.use(cors())
////

// temp user endpoint

app.get("/currentUser", (req,res)=>{
  if (!req.user){
    res.json({
      user: "none"
    })
  }else{
    res.json({
      user: req.user
    })
  }
})
// testing registration
app.post("/register", (req,res)=>{
  var formData = req.body // if this is modified, change the landingpage fields as well as ppConfig
  if(formData.email === "" || formData.name === "" ){
    res.json({
      error: true,
      data: "missingFields"
    })
  // }else if(formData.passwordCfm !== formData.password){
  //   req.flash("error","Passwords do not match, please try again")
  //   res.redirect("/landingpage")
  }else{
    User.find({email: formData.email}).count()
    .then(result=>{
      if(result === 0){
        let newUser = new User({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        newUser.save()
        .then(user=>{
          res.json({
            error: false,
            data: "registrationSuccess"
          })
        })
      }else{
        res.json({
          error: true,
          data: "registrationFailure_emailExists"
        })
      }
    })
  }
})

// testing Login
app.post("/login", passport.authenticate("local",{
  successRedirect: "/successjson",
  failureRedirect: "/failurejson",
  failureFlash: true
})
)
// testing logout
app.get('/logout', (req, res) => {
  req.logout()
  res.json({
    status: "logoutSuccess"
  })
})

app.get('/successjson', (req, res)=> {
    res.json({
      status: "loginSuccess",
      userData: req.user
    });
});

app.get('/failurejson', function(req, res) {
    res.json({
      status: "loginFailure",
      message: 'failed to connect'
     });
});

app.get("/staff", (req,res)=>{
  Restaurant.findById("5a16f5af351a2b1ea8904b1f")
  .then(resto=>{
    Restotable.find(`restaurant_id=${resto.id}`)
    .then(tableorders=>{
      res.render("owners/main",{
        title: "Staff Page",
        resto,
        tableorders
      })
    })
  })
})
app.get('/', function(req, res) {
  Restaurant.find()
  .then(resto=>{

    Restotable.find("restaurant_id=1")
    .then(table=>{

    res.render('defaultviews/home',{
      title: "Home Page",
      resto,
      table

   })
 })
})

});

app.get('/register', function(req, res) {
  res.render('users/register',{
    title: "Register Page"

 })
});

app.get('/login', function(req, res) {
  res.render('users/login',{
    title: "Login Page"

 })
});
app.post("/addrestaurant", (req,res)=>{
  let newRes = new Restaurant({
    name: req.body.name,
    cuisine: req.body.cuisine,
    address: req.body.address,
    contact: req.body.contact,
    tables: req.body.tableNo

  })

  newRes.save()
  .then(()=>{
    res.redirect("/")
  })
})


app.post('/addtableorder', (req,res)=>{
  let newTable = new Restotable({
    user_id: 1,
    restaurant_id: 1,
    transaction_id: 12,
    table_number: 3,
    dishes: ["empty"],
    status: "cooked"
  })

  newTable.save()
  .then(()=>{
    res.redirect("/")
  })
})

app.get('/payment', function(req, res) {
  res.render('defaultviews/payment',{
    title: "Payment Page"

 })
});

// sockets setup

io.on('connection', (socket) => {
  console.log('===> Socket Connected : ', socket.id)
  socket.on('chat', (data) => {
    console.log('frontend connection', data)
  })
  socket.on('submitOrder', (message) => {
    console.log('from frontend connection', message)
    io.emit("orderConfirmed",{
      message: "test",
      data: 123123123
    })

  socket.on('disconnect', () => {
    console.log('===> Socket Disconnected : ', socket.id)
  })
})

  // here you can start emitting events to the client
});


const port = 8000;
// io.listen(port);
server.listen(port)

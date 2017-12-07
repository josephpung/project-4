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
  Restaurant.findById("5a1ed7560400ce4dd446f8d5")
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
  .then((result)=>{
    res.json({
      message: "Restaurant Added"
    })
    for (var x=1; x<= req.body.tableNo; x++){
        var tableNumber = x.toString() + "A"
      let newRestoTable = new Restotable({
        user_id: "nil",
        restaurant_id: result._id,
        transaction_id: "n.a",
        table_number: tableNumber,
        foodStatus: "Preparing",
        dishes: []
      })

      newRestoTable.save()
      .then(table=>{
        console.log("New Table Added \n");
      })
    }
  })
})

app.get("/allTables", (req,res)=>{
  Restotable.find()
  .then(data=>{
    res.json(data)
  })
})

app.get("/table/:id", (req,res)=>{
Restotable.findById(req.params.id)
.then(result=>{
  res.json(result)
})
})

app.get("/menu/:id", (req,res)=>{
Item.find({restaurant_id: req.params.id})
.then(result=>{
  res.json(result)
})
})

app.post('/addtableorder', (req,res)=>{
  var tempObj = {}
  Restotable.findById(req.body.id)
  .then(result=>{
    for (var key in result.dishes){
      tempObj[key] = result.dishes[key]
      console.log(key);
    }
    for(var key in req.body.restaurantMenu){
      if(req.body.restaurantMenu[key] === "0"){
          delete tempObj[key]
      }else{
        tempObj[key] = req.body.restaurantMenu[key]
      }
    }
    Restotable.findByIdAndUpdate(req.body.id,{ $set:{dishes: tempObj}})
    .then(res=>{
      console.log(res);
    })

  })



})
app.post("/additems", (req,res)=>{
  let newItem = new Item({
    restaurant_id: req.body.restoId,
    category: req.body.category,
    name: req.body.name,
    price: req.body.price
  })
  newItem.save()
  .then(result=>{
    res.json({
      message: "Item added",
      itemDetails: result
    })
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
  socket.on('submitOrder', (message) => {
    console.log('from frontend connection', message)
    io.emit("orderConfirmed",{
      message: "test",
      data: 123123123
    })

})

  // here you can start emitting events to the client
});


// io.listen(port);
server.listen(port)

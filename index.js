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
require("dotenv").config({silent: true})



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

// handlebars helper
var helpers = require('handlebars-helpers')
var math = helpers.math()

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
app.use((req, res, next) => {
  app.locals.user = req.user
  next()
})
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

//Access models
const Restaurant = require("./models/restaurant")
const Restotable = require("./models/restotable")
const User = require('./models/user')
const Item = require('./models/item')



////
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
app.get('/register', function (req, res) {
  res.render('users/register', {
    title: 'Register Page'

  })
})

app.post('/register', (req, res) => {
  var formData = req.body.user
  var newUser = new User({
    name: formData.name,
    email: formData.email,
    password: formData.password
  })
  newUser.save()
  .then((newUser) => {
    passport.authenticate('local', {
      successRedirect: '/'
    })(req, res)
  },
  err => {
    console.log('err')
    res.redirect('users/register')
  })
})

app.get('/login', function(req, res) {
  res.render('users/login',{
    title: "Login Page"

 })
})

app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log('successfuly log in')
  res.redirect(`/`)
})


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

app.get('/order', (req, res) => {
  const Item = require('./models/item')
  Item.find()
  .then(menuItem => {
    res.render('users/order', {
      title: 'Order Page',
      menuItem
    })
  })
})


app.post('/addMenuToOrder', (req, res) => {
  let user = req.user
  if (!user) {
    console.log('User is not Logged in')
    res.redirect('/login')
  }
  let formData = req.body.foods
  let newArray = []
  for (const prop in formData) {
    if (formData[prop] !== '0') {
      let dish = {}
      dish[`${prop}`] = `${formData[prop]}`
      newArray.push(dish)
    }
  }
  let newOrder = new Restotable({
    dishes: newArray,
    user_id: `${user.id}`
  })
  newOrder.save()
  .then((order) => {
    res.redirect('/pay')
  })
})

app.get('/pay', (req, res) => {
  Restotable.findOne({
    user_id: req.user.id
  })
  .then(order => {
    console.log(order)
    // extract all the dishes ID from dishes ordered array
    let dishesOrdered = order.dishes
    let dishArr = []
    let quantityOrder = []
    dishesOrdered.map(oneDish => {
      for (const prop in oneDish) {
        dishArr.push(prop)
        let dish = {}
        dish['amount'] = `${oneDish[prop]}`
        quantityOrder.push(dish)
        // quantityOrder.push(Number(oneDish[prop]))
      }
    })
    // find all dishes that was ordered from Item array
    Item.find({
      _id: {$in: dishArr}
    })
      .then(dishesOrdered => {
        let newDishesOrdered = []
        // in order for us to do complex multiplication, i had to merged quantity ordered
        // with our dishesOrdered array
        dishesOrdered = dishesOrdered.map((eachDish, index) => {
          let obj2 = quantityOrder[index]
          const merged = Object.assign(JSON.parse(JSON.stringify(eachDish)), obj2)
          newDishesOrdered.push(merged)
        })
        res.render('users/pay', {
          title: 'Current Bill',
          newDishesOrdered,
          math,
          quantityOrder
        })
      })
  })
})


app.get('/payment', function(req, res) {
  res.render('defaultviews/payment',{
    title: "Payment Page"

 })
});

app.listen(8000, () => {
  'connected to port 8000 successfully'
})

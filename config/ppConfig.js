const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/user")
const Admin = require("../models/admin")


passport.serializeUser(function(user,done){
  const userInfo = {
    id: user.id,
    type: user.type
  }
  done(null,userInfo)
})

passport.deserializeUser(function(user,done){

if(user.type === "user"){
  User.findById(user.id, function(err,user){
    return done(err,user)
  })
}else{
  Admin.findById(user.id, function(err,user){
    return done(err,user)
  })
}

})

passport.use("local",new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done){
  User.findOne({email: email}, function(err, user){
    if(err) return done(err)
    if (!user) return done(null, false)
    user.validPassword(password,  (err, isMatch) => {
      if (err) return done(null, false)
      if (isMatch) return done(null, user)
      return done(null, false, { message: 'passwords mismatch'})
    })

  })
}))

passport.use("local_admin",new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done){
  Admin.findOne({email: email}, function(err, user){
    if(err) return done(err)
    if (!user) return done(null, false)
    user.validPassword(password,  (err, isMatch) => {
      if (err) return done(null, false)
      if (isMatch) return done(null, user)
      return done(null, false, { message: 'passwords mismatch'})
    })

  })
}))

module.exports = passport

const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')


const adminSchema = new Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: {type: String},
  pic: String,
  adminCode: {type: String, required: true},
  type: {type: String, default: "admin"}
})


adminSchema.pre("save", function(next){

  var admin = this

  // if (!user.isModified('password')) return next();

  //hash the password
  bcrypt.hash(admin.password, 10)
  .then(hash =>{
    console.log(`[ADMIN PASSWORD HASH]: The hash is ${hash}, password is ${admin.password}`)
    admin.password = hash
      next();
  })

})

adminSchema.methods.validPassword = function(plainPassword, callback) {
  // Compare is a bcrypt method that will return a boolean,
  bcrypt.compare(plainPassword, this.password, callback)
}



const Admin = mongoose.model('Admin', adminSchema)

// make this available to our other files
module.exports = Admin

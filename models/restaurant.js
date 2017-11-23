const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const restaurantSchema = new Schema({
  name: {type:String, required: true},
  cuisine: {type: String, required: true},
  tables: Number,
  address: String,
  contact: String

})

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

module.exports = Restaurant

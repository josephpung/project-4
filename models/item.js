const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const itemSchema = new Schema({
  name: {type:String, required: true},
  category: {type:String, required: true},
  restaurant_id: String,
  price: Number

})

const Item = mongoose.model("Item", itemSchema)

module.exports = Item

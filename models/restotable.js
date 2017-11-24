const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const restotableSchema = new Schema({
  user_id: String,
  restaurant_id: String,
  transaction_id: String,
  table_number: String,
  dishes: Array,
  status: String

})

const Order = mongoose.model("Restotable", restotableSchema)

module.exports = Order

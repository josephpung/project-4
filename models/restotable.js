const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const restotableSchema = new Schema({
  user_id: String,
  restaurant_id: String,
  table_number: String,
  dishes: Object,
  status: String

})

const Restotable = mongoose.model("Restotable", restotableSchema)

module.exports = Restotable

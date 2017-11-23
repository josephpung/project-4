const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const transactionSchema = new Schema({
  order_id: {type: String, required: true},
  user_id: Array,
  status: String

})

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = Transaction

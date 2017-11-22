const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const transactionSchema = new Schema({
  order_id: String, required: true,
  status: String

})

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = Transaction

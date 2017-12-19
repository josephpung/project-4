const express = require("express")
const router = express.Router()

const Restaurant = require("../models/restaurant")
const Restotable = require("../models/restotable")
const Item = require("../models/item")

router.get('/main', function(req, res) {
  Restaurant.find({})
  .then(resto=>{
    res.json({resto})
  })

})

router.get("/table/:id", (req,res)=>{

  Restotable.findById(req.params.id)
  .then(result=>{
  res.json(result)
  })
})

router.get("/allTables", (req,res)=>{
  Restotable.find()
  .then(data=>{
    res.json(data)
  })
})

router.get("/menu/:id", (req,res)=>{
  Item.find({restaurant_id: req.params.id})
  .then(result=>{
    console.log(result);
    res.json(result)
    })
})

module.exports= router

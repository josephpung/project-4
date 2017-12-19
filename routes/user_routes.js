const express = require("express")
const router = express.Router()

const Restotable = require("../models/restotable")
const User = require("../models/user")


router.post('/adduserorder', (req,res)=>{
  var tempObj = {}
  Restotable.findById(req.body.id)
  .then(result=>{
    for (var key in result.dishes){
      tempObj[key] = result.dishes[key]
      console.log(key);
    }
    for(var key in req.body.restaurantMenu){
      if(req.body.restaurantMenu[key] === "0"){
          delete tempObj[key]
      }else{
        if(tempObj[key]){
          tempObj[key] = (Number(tempObj[key]) + Number(req.body.restaurantMenu[key])).toString()
        }else{
          tempObj[key] = req.body.restaurantMenu[key]
        }

      }
    }
    Restotable.findByIdAndUpdate(req.body.id,{ $set:{dishes: tempObj}})
    .then(res=>{
      // console.log(res);
    })

  })



})


router.post("/save_user_order", (req,res)=>{

  User.findByIdAndUpdate(req.body.userId,{savedOrder: req.body.orders})
  .then(result=>{
    res.json({
      message: "Order Saved",
      details: result
    })
  })
})

module.exports= router

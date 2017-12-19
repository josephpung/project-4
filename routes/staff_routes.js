const express = require("express")
const router = express.Router()


const Restaurant = require("../models/restaurant")
const Restotable = require("../models/restotable")
const Item = require("../models/item")

router.post("/additems", (req,res)=>{
  let newItem = new Item({
    restaurant_id: req.body.restoId,
    category: req.body.category,
    name: req.body.name,
    price: req.body.price
  })
  newItem.save()
  .then(result=>{
    res.json({
      message: "Item added",
      itemDetails: result
    })
  })
})


router.post("/addrestaurant", (req,res)=>{
  let newRes = new Restaurant({
    name: req.body.name,
    cuisine: req.body.cuisine,
    address: req.body.address,
    contact: req.body.contact,
    tables: req.body.tableNo

  })

  newRes.save()
  .then((result)=>{
    res.json({
      message: "Restaurant Added"
    })
    for (var x=1; x<= req.body.tableNo; x++){
        var tableNumber = x.toString() + "A"
      let newRestoTable = new Restotable({
        user_id: "nil",
        restaurant_id: result._id,
        transaction_id: "n.a",
        table_number: tableNumber,
        foodStatus: "Preparing",
        dishes: []
      })

      newRestoTable.save()
      .then(table=>{
        console.log("New Table Added \n");
      })
    }
  })
})


router.post('/addtableorder', (req,res)=>{
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
        tempObj[key] = req.body.restaurantMenu[key]
      }
    }
    Restotable.findByIdAndUpdate(req.body.id,{ $set:{dishes: tempObj}})
    .then(res=>{
      // console.log(res);
    })

  })



})

module.exports= router

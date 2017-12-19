const express = require("express")
const router = express.Router()
const passport = require("../config/ppConfig")

const User = require("../models/user")

router.post("/register", (req,res)=>{
  console.log("Data received from frontend: ",req.body);
  var formData = req.body // if this is modified, change the landingpage fields as well as ppConfig
  if(formData.email === "" || formData.name === "" ){
    res.json({
      error: true,
      data: "missingFields"
    })
  // }else if(formData.passwordCfm !== formData.password){
  //   req.flash("error","Passwords do not match, please try again")
  //   res.redirect("/landingpage")
  }else{
    User.find({email: formData.email}).count()
    .then(result=>{
      if(result === 0){
        let newUser = new User({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        newUser.save()
        .then(user=>{
          res.json({
            error: false,
            data: "registrationSuccess"
          })
        })
      }else{
        res.json({
          error: true,
          data: "registrationFailure_emailExists"
        })
      }
    })
  }
})


router.post("/login", passport.authenticate("local",{
  successRedirect: "/authentication/successjson",
  failureRedirect: "/authentication/failurejson",
  failureFlash: true
})
)

router.get('/logout', (req, res) => {
  req.logout()
  res.json({
    status: "logoutSuccess"
  })
})

router.get('/successjson', (req, res)=> {
    res.json({
      status: "loginSuccess",
      userData: req.user
    });
});

router.get('/failurejson', function(req, res) {
    res.json({
      status: "loginFailure",
      message: 'failed to connect'
     });
});

module.exports= router

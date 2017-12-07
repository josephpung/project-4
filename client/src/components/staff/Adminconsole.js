import React, { Component } from 'react';
import axios from 'axios'


class App extends Component {
  constructor(){
    super()

    this.state={
      restaurantObj: {},
      dishObj: {}

    }
  }
  handleDish = (e) =>{
    var a ={...this.state.dishObj}
    a[e.target.name] = e.target.value
    this.setState({
      dishObj: a
    })
  }
  submitDish(e){
    console.log(this.state.dishObj)
    axios.post("/additems",this.state.dishObj)
    .then(response=>{
      console.log(response);
    })
  }

  handleResto = (e) =>{
    var x ={...this.state.restaurantObj}
    x[e.target.name] = e.target.value
    this.setState({
      restaurantObj: x
    })
  }
  submitResto(e){
    console.log(this.state.restaurantObj)
    axios.post("/addrestaurant",this.state.restaurantObj)
    .then(response=>{
      console.log(response);
    })
  }

  render() {
    return (
      <div>
        <h1>ADMIN CONSOLE PAGE</h1>
        <h5>Add Restaurant</h5>
        <div className = "row">
          <div className = "col s2">
            <label>Restaurant Name:</label>
            <input name="name" onChange={(e)=>{ this.handleResto(e)}}></input>
          </div>
          <div className = "col s2">
            <label>Cuisine:</label>
            <input name="cuisine" onChange={(e)=>{ this.handleResto(e)}}></input>
          </div>
          <div className = "col s2">
            <label>Address:</label>
            <input name="address" onChange={(e)=>{ this.handleResto(e)}}></input>
          </div>
          <div className = "col s2">
            <label>Contact:</label>
            <input name="contact" onChange={(e)=>{ this.handleResto(e)}}></input>
          </div>
          <div className = "col s2">
            <label>Number of Tables:</label>
            <input name="tableNo" onChange={(e)=>{ this.handleResto(e)}}></input>
          </div>
          <div className = "col s2">
            <button className = "btn yellow black-text" onClick={(e)=>{ this.submitResto(e)}}>Submit</button>
          </div>
        </div>
        <div className = "divider"></div>

        <h5>Add Dishes (Restaurant Must Exist)</h5>

        <div className = "row">
          <div className = "col s2">
            <label>Restaurant Id:</label>
            <input name="restoId" onChange={(e)=>{ this.handleDish(e)}}></input>
          </div>
          <div className = "col s2">
            <label>Category:</label>
            <input name="category" onChange={(e)=>{ this.handleDish(e)}}></input>
          </div>
          <div className = "col s2">
            <label>Name:</label>
            <input name="name" onChange={(e)=>{ this.handleDish(e)}}></input>
          </div>
          <div className = "col s2">
            <label>Price:</label>
            <input name="price" onChange={(e)=>{ this.handleDish(e)}}></input>
          </div>
          <div className = "col s2">
            <button className = "btn yellow black-text" onClick={(e)=>{ this.submitDish(e)}}>Add Dish</button>
          </div>
        </div>
      </div>
    )
  }
}


export default App

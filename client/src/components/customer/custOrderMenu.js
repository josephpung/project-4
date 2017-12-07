import React, { Component } from 'react'
import { Tabs, Tab, Table, Input, Button} from 'react-materialize'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import socket from '../../API/socketAPI'

class Menu extends Component {
  constructor (props) {
    super()
    this.state = {
      testText: "NO DATA RECEIVED",
      errorMessage: "",
      restaurantMenu: [],
      restaurantMenuDisplay: [],
      hideMenu: false,
      tableNumber:"",
      currentTab: 0,
      category: ['Appetizers', 'Mains', 'Dessert', 'Drinks' ],
      tab: {
        Appetizers: true,
        Mains: false,
        Dessert: false,
        Drinks: false
      },
      submitObj: {}
    }
  }

  handleOnChange = (e) => {

    const copiedRestaurantMenu = [...this.state.restaurantMenu]
    if (Number(e.target.value) > 0) {
    const selectedMenu = copiedRestaurantMenu.find(menu => menu._id === e.target.id)
    // update quantity to the object
    selectedMenu.quantity = e.target.value

    let tempObj = {...this.state.submitObj}
      tempObj[e.target.name] = e.target.value

    // setState for restaurantMenu
    this.setState({
      restaurantMenuDisplay: copiedRestaurantMenu,
      submitObj: tempObj
      })
    }else if(Number(e.target.value) === 0) {
      const copiedRestaurantMenu = [...this.state.restaurantMenu]
      const selectedMenu = copiedRestaurantMenu.find(menu => menu._id === e.target.id)
        delete selectedMenu.quantity

      let tempObj = {...this.state.submitObj}

        // tempObj[e.target.name] = e.target.value
       tempObj[e.target.name] = "0"

      this.setState({
        restaurantMenuDisplay: copiedRestaurantMenu,
        submitObj: tempObj
      })

  }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { match: { params } } = this.props

    axios.post("/adduserorder", {
      id: params.restoTableId,
      restaurantMenu: this.state.submitObj
    })
    .then(res => console.log(res.data))

    socket.emit("submitOrder")

  }

  toggle =(e)=>{
    this.setState({
      hideMenu: !this.state.hideMenu
    })
  }

  // should be placeed into Tab component like onClick
  handleTab = (tabIndex) => {
    const tempObj = {}
    this.state.category.forEach((category, index) => {
      tempObj[category] = Number(tabIndex.slice(-1)) === index ? true : false
    })

    this.setState({
      tab: tempObj
    })
  }
  componentWillMount(){
    const { match: { params } } = this.props
    axios.get(`/table/${params.restoTableId}`)
    .then(result=>{

      this.setState({
        tableNumber: result.data.table_number
      })
      axios.get(`/menu/${result.data.restaurant_id}`)
      .then(response =>{
        console.log("this one", response.data);
        this.setState({
            restaurantMenuDisplay: response.data
          })
      })

    })

    ///////
    function isEmpty( obj ) {
      for ( var prop in obj ) {
        return false;
      }
      return true;
    }
    ///////
    axios.get(`/table/${params.restoTableId}`)
    .then(result=>{

      this.setState({
        tableOrders: result.data.dishes,
        tableNumber: result.data.table_number
      })
      axios.get(`/menu/${result.data.restaurant_id}`)
      .then(response =>{

        if(!isEmpty(this.state.tableOrders)){
          var menuList = []
          response.data.forEach(menuItem =>{
            for (var key in this.state.tableOrders){
              if(key === menuItem.name){

                menuItem["quantity"] = this.state.tableOrders[menuItem.name]
                menuList.push(menuItem)
              }else{
                menuList.push(menuItem)
              }
            }
          })
          var unique = menuList.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
          })
          console.log("final: ",unique)
          this.setState({
            restaurantMenu: unique
          })

        }else{
          this.setState({
            restaurantMenu: response.data
          })
        }

      })
    })
  }
  componentDidMount(){
    const { match: { params } } = this.props

    socket.on("orderConfirmed", (data)=>{
      function isEmpty( obj ) {
        for ( var prop in obj ) {
          return false;
        }
        return true;
      }
      ///////
      axios.get(`/table/${params.restoTableId}`)
      .then(result=>{

        this.setState({
          tableOrders: result.data.dishes,
          tableNumber: result.data.table_number
        })
        axios.get(`/menu/${result.data.restaurant_id}`)
        .then(response =>{

          if(!isEmpty(this.state.tableOrders)){
            var menuList = []
            response.data.forEach(menuItem =>{
              for (var key in this.state.tableOrders){
                if(key === menuItem.name){

                  menuItem["quantity"] = this.state.tableOrders[menuItem.name]
                  menuList.push(menuItem)
                }else{
                  menuList.push(menuItem)
                }
              }
            })
            var unique = menuList.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            })
            console.log("final: ",unique)
            this.setState({
              restaurantMenu: unique
            })

          }else{
            this.setState({
              restaurantMenu: response.data
            })
          }

        })
      })
    })
  }

  render () {
    const mains = []
    const appetizer = []
    const dessert = []
    const drinks = []
    console.log("here",this.state.restaurantMenu);
    this.state.restaurantMenuDisplay.forEach((eachMenu) => {
      if(eachMenu.category === 'mains')
      return mains.push(eachMenu)
      else if(eachMenu.category === 'appetizer')
      return appetizer.push(eachMenu)
      else if(eachMenu.category === 'dessert')
      return dessert.push(eachMenu)
      else if(eachMenu.category === 'drinks')
      return drinks.push(eachMenu)
      else
      return Error('Error')
    })

    let appetizerTab = appetizer.map((item, index) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </Input>
        </td>
      </tr>
      )
    })

    let mainsTab = mains.map((item) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          {/* onChange */}
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </Input>
        </td>
      </tr>
      )
    })
    let dessertTab = dessert.map((item) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          {/* onChange */}
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </Input>
        </td>
      </tr>
      )
    })
    let drinksTab = drinks.map((item) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </Input>
        </td>
      </tr>
      )
    })

    if(appetizer.length === 0)appetizerTab = <tr><td><h3>Coming Soon!</h3></td></tr>
    if(mains.length === 0)mainsTab = <tr><td><h3>Coming Soon!</h3></td></tr>
    if(dessert.length === 0)dessertTab =<tr><td><h3>Coming Soon!</h3></td></tr>
    if(drinks.length === 0)drinksTab =<tr><td><h3>Coming Soon!</h3></td></tr>


    let order = this.state.restaurantMenu.map(dish=>{
      if(dish.quantity){
        return (
          <tr key={dish._id}>
            <td>{dish.name}</td>
            <td>{dish.quantity}</td>
            <td>${dish.price*dish.quantity}</td>
          </tr>
        )
      }

    })

    let totalPrice = this.state.restaurantMenu.length >0 ? this.state.restaurantMenu.map(dish=>{
        return  dish.quantity!== undefined ? dish.price*dish.quantity : 0 }).reduce((a,b)=>{ return a+b}) : 0

    if(this.state.hideMenu){
      return (
        <div>
        <h1 className="center">Open Orders</h1>

        <div className="col s5">
        <h3>Table {this.state.tableNumber}</h3>

        <ul className="collection">
          <li className="collection-item ">
            <Table>
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order}
              </tbody>
            </Table>
          </li>
        </ul>

        </div>
        <Table>
        	<thead>
            <tr>
              <th></th>
            </tr>
        	</thead>
        	<tbody>
        		<tr>
              <td></td>
              <td className="right-align"><label>Subtotal:</label></td>
        			<td>${totalPrice}</td>
        		</tr>
            <tr>
              <td></td>
              <td className="right-align"><label>GST & Service Charge</label></td>
        			<td>${(totalPrice*.1).toFixed(2)}</td>
        		</tr>
            <tr>
              <td></td>
              <td className="right-align"><label>Total</label></td>
        			<td>${(totalPrice*1.1).toFixed(2)}</td>
        		</tr>
        	</tbody>
        </Table>
        <Button onClick={e => this.toggle(e)}>Menu</Button>
        <Link to={"/menu"} className="btn right black">Pay Bill beetch</Link>

        </div>
      )
    }else{
    return (
      <div>
        {this.state.testText}
        <h1>Table {this.state.tableNumber}</h1>

        <h2 className="red-text">{this.state.errorMessage}</h2>
        <form>
          <Tabs className='tab-demo z-depth-1' onChange={ this.handleTab } >
            <Tab title='Appetizers' active={this.state.tab.Appetizers}>
              <Table>
                <thead>
                  <tr>
                    <th data-field='id'>Food Item</th>
                    <th data-field='name'>Price</th>
                    <th data-field='price'>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                    {appetizerTab}
                </tbody>
              </Table>
            </Tab>
            <Tab title='Mains' active={this.state.tab.Mains}>
              <Table>
                <thead>
                  <tr>
                    <th data-field='id'>Food Item</th>
                    <th data-field='name'>Price</th>
                    <th data-field='price'>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                    {mainsTab}
                </tbody>
              </Table>
            </Tab>
            <Tab title='Dessert' active={this.state.tab.Dessert}>
              <Table>
                <thead>
                  <tr>
                    <th data-field='id'>Food Item</th>
                    <th data-field='name'>Price</th>
                    <th data-field='price'>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                    {dessertTab}
                </tbody>
              </Table>
            </Tab>
            <Tab title='Drinks' active={this.state.tab.Drinks}>
              <Table>
                <thead>
                  <tr>
                    <th data-field='id'>Food Item</th>
                    <th data-field='name'>Price</th>
                    <th data-field='price'>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                    {drinksTab}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
          <div className="row red-text">
            Please note that this order is only sent to the kitchen upon confirmation at the restaurant
          </div>
          <Button onClick={e => this.handleSubmit(e)} waves='light'>Confirm Order</Button>
          <Button onClick={e => this.toggle(e)}>View Bill</Button>

        </form>

      </div>
    )
    }
  }
}

const mapStateToProps = (state) =>{
  return {
    user: state.users
  }
}

export default connect(mapStateToProps)(Menu)

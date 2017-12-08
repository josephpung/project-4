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
      restaurantMenu: copiedRestaurantMenu,
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
        restaurantMenu: copiedRestaurantMenu,
        submitObj: tempObj
      })

  }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (!this.props.user.loggedIn){
      this.setState({
        errorMessage: "Please login to save order"
      })
    }else{

    socket.emit('submitOrder', '[FRONTEND]= DATA WILL COME THROUGH HERE')

    axios.post("/save_user_order", {
      userId: this.props.user.id,
      orders: this.state.submitObj
    })
    .then(res => console.log(res.data))
  }

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

  componentDidMount(){

    socket.on("orderConfirmed", (data)=>{
      this.setState({
        testText: data.message
      })
    })
    const { match: { params } } = this.props
    axios.get(`/menu/${params.restoId}`)
    .then(res=>{
      this.setState({
        restaurantMenu: res.data
      })
      console.log(res.data);
    })
  }

  render () {
    const mains = []
    const appetizer = []
    const dessert = []
    const drinks = []

    this.state.restaurantMenu.forEach((eachMenu) => {
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

    return (
      <div>
        <h1 className="center">Kindly Select Dishes</h1>
        <p className="center">Saved dishes cannot be modified, please take note</p>

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
          <Button onClick={e => this.handleSubmit(e)} waves='light'>Save Order</Button>
          {/* <Link to={"/customer_table_order"} className="btn right">View Bill</Link> */}

        </form>

      </div>
    )
  }
}

const mapStateToProps = (state) =>{
  return {
    user: state.users
  }
}

export default connect(mapStateToProps)(Menu)

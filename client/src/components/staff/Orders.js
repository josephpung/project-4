import React, { Component } from 'react'
import { Tabs, Tab, Table, Input, Button} from 'react-materialize'
import axios from 'axios'

const restaurantMenu = [
  {
    id: 1,
    category: 'mains',
    name: 'LOBSTER AND CRABMEAT RAVIOLI',
    price: 18
  },
  {
    id: 2,
    category: 'mains',
    name: 'QUATTRO FORMAGGIO',
    price: 15
  },
  {
    id: 3,
    category: 'appetizer',
    name: "DOUGH BALLS 'PIZZAEXPRESS'",
    price: 8
  },
  {
    id: 4,
    category: 'mains',
    name: 'SPAGHETTI BOLOGNESE',
    price: 14
  },
  {
    id: 5,
    category: 'mains',
    name: 'CALABRESE',
    price: 22
  },
  {
    id: 6,
    category: 'dessert',
    name: 'BIG BAD BROWNIE',
    price: 7
  },
  {
    id: 7,
    category: 'appetizer',
    name: 'ANTIPASTO ITALIANO',
    price: 17
  }
]


class Orders extends Component {
  constructor (props) {
    super()
    this.state = {
      restaurantMenu,
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

  handleSubmit = (e) => {
        e.preventDefault()

        axios.post("addtableorder", {
          restaurantMenu: this.state.submitObj
        })
        .then(res => console.log(res.data))

        // axios.post("additem", {
        // })
        // .then(res => console.log(res.data))
  }

  handleOnChange = (e) => {
    const copiedRestaurantMenu = [...this.state.restaurantMenu]
    if (e.target.value > 0) {
    const selectedMenu = copiedRestaurantMenu.find(menu => menu.id === Number(e.target.id))
    // update quantity to the object
    selectedMenu.quantity = e.target.value

    let tempObj = {...this.state.submitObj}
      tempObj[e.target.name] = e.target.value

    // setState for restaurantMenu
    this.setState({
      restaurantMenu: copiedRestaurantMenu,
      submitObj: tempObj
      })
      console.log(this.state.submitObj);
    }
    console.log(this.state.restaurantMenu)
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

  render () {
    const appetizer = []
    const mains = []
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
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>
          <Input s={5} id={item.id.toString()} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
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
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>
          {/* onChange */}
          <Input s={5} id={item.id.toString()} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
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
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>
          {/* onChange */}
          <Input s={5} id={item.id.toString()} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
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
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>
          <Input s={5} id={item.id.toString()} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
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
    <div className="row">
      <div className="col s5">
      <h1>View Order</h1>

      <ul className="collection">
        <li className="collection-item avatar">
          <span className="title">Name</span>
          <p>Price</p>
          <p>Quanity</p>
        </li>
      </ul>

      </div>

      <div className="col s7">
          <h1>Order Here</h1>

        <form>

          <Tabs className='tab-demo z-depth-1' onChange={ this.handleTab }>

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

            <div className="row">

              <div className="col s5">
                <Button onClick={e => this.handleSubmit(e)} waves='light'>Confirm Order</Button>
              </div>

            </div>

          </form>

      </div>
    </div>
    )
  }
}

export default Orders

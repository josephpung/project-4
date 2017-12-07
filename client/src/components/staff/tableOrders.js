import React, { Component } from 'react'
import { Tabs, Tab, Table, Input, Button} from 'react-materialize'
import { connect } from 'react-redux'
import { reloadUser } from '../../actions/userAction'
import axios from 'axios'
import { Link } from 'react-router-dom'
import socket from '../../API/socketAPI'


class Orders extends Component {
  constructor (props) {
    super()
    this.state = {
      tableId: "",
      tableNumber: "",
      restaurantMenu: [],
      userRestaurantMenu: [],
      userDisplayMenu: true,
      tableOrders: {},
      currentDishArr: [],
      restoId: "",
      currentTab: 0,
      category: ['Appetizers', 'Mains', 'Dessert', 'Drinks' ],
      tab: {
        Appetizers: true,
        Mains: false,
        Dessert: false,
        Drinks: false
      },
      userTab: {
        Appetizers: true,
        Mains: false,
        Dessert: false,
        Drinks: false
      },
      submitObj: {}
    }
  }

  reload = (e) =>{
    this.props.refreshUser()
  }

  handleSubmit = (e) => {
        e.preventDefault()

        axios.post("/addtableorder", {
          id: this.state.tableId,
          restaurantMenu: this.state.submitObj
        })
        .then(res => console.log(res.data))
        socket.emit("submitOrder")
  }

  userTabChange=(e)=>{
    const copiedRestaurantMenu = [...this.state.userRestaurantMenu]
    if (Number(e.target.value) > 0) {
    const selectedMenu = copiedRestaurantMenu.find(menu => menu._id === e.target.id)
    // update quantity to the object
    selectedMenu.quantity = e.target.value

    let tempObj = {...this.state.submitObj}
      tempObj[e.target.name] = e.target.value
    // setState for restaurantMenu
    this.setState({
      userRestaurantMenu: copiedRestaurantMenu,
      submitObj: tempObj
      })

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

  // should be placed into Tab component like onClick
  userHandleTab = (tabIndex) => {
    const tempObj = {}
    this.state.category.forEach((category, index) => {
      tempObj[category] = Number(tabIndex.slice(-1)) === index ? true : false
    })

    this.setState({
      userTab: tempObj
    })
  }
  handleTab = (tabIndex) => {
    const tempObj = {}
    this.state.category.forEach((category, index) => {
      tempObj[category] = Number(tabIndex.slice(-1)) === index ? true : false
    })

    this.setState({
      tab: tempObj
    })
  }

  toggleShowMenu(){
    this.setState({
      userDisplayMenu: !this.state.userDisplayMenu
    })
  }
  componentWillMount(){
    function isEmpty( obj ) {
      for ( var prop in obj ) {
        return false;
      }
      return true;
    }
    const { match: { params } } = this.props
    axios.get(`/table/${params.restoTableId}`)
    .then(result=>{

      this.setState({
        tableOrders: result.data.dishes,
        tableNumber: result.data.table_number
      })
      axios.get(`/menu/${result.data.restaurant_id}`)
      .then(response =>{
        // console.log("wtf", response.data);
          this.setState({
            userRestaurantMenu: response.data
          })
        })
      })
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
    function isEmpty( obj ) {
      for ( var prop in obj ) {
        return false;
      }
      return true;
    }
    const { match: { params } } = this.props
    socket.on("orderConfirmed", (data)=>{
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
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.handleOnChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
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
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
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
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
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
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>

          </Input>
        </td>
      </tr>
      )
    })

    //user menu data loading
    const userAppetizer = []
    const userMains = []
    const userDessert = []
    const userDrinks = []

    this.state.userRestaurantMenu.forEach((eachMenu) => {
      if(eachMenu.category === 'mains')
      return userMains.push(eachMenu)
      else if(eachMenu.category === 'appetizer')
      return userAppetizer.push(eachMenu)
      else if(eachMenu.category === 'dessert')
      return userDessert.push(eachMenu)
      else if(eachMenu.category === 'drinks')
      return userDrinks.push(eachMenu)
      else
      return Error('Error')
    })

    let userAppetizerTab = userAppetizer.map((item, index) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.userTabChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </Input>
        </td>
      </tr>
      )
    })

    let userMainsTab = userMains.map((item) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          {/* onChange */}
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.userTabChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </Input>
        </td>
      </tr>
      )
    })

    let userDessertTab = userDessert.map((item) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          {/* onChange */}
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.userTabChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </Input>
        </td>
      </tr>
      )
    })

    let userDrinksTab = userDrinks.map((item) => {
      return(
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>${item.price}</td>
        <td>
          <Input s={5} id={item._id} name={item.name} type='select' label='Quantity' defaultValue={item.quantity} onChange={this.userTabChange}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>

          </Input>
        </td>
      </tr>
      )
    })


    if(userAppetizer.length === 0)userAppetizerTab = <tr><td><h3>Coming Soon!</h3></td></tr>
    if(userMains.length === 0)userMainsTab = <tr><td><h3>Coming Soon!</h3></td></tr>
    if(userDessert.length === 0)userDessertTab =<tr><td><h3>Coming Soon!</h3></td></tr>
    if(userDrinks.length === 0)userDrinksTab =<tr><td><h3>Coming Soon!</h3></td></tr>


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

   if (this.props.user.type ==="user" && this.props.user.loggedIn && !this.state.userDisplayMenu){
      return (
        <div>
        <h1 className="center">View Ordersz</h1>

        <div className="col s5">
        <h1>Table {this.state.tableNumber}</h1>

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
        <button className="btn" onClick={()=>{ this.toggleShowMenu()}}>View Menu</button>
        <Link to={"/menu"} className="btn right black">Pay Bill beetch</Link>

        </div>
      )
    }else if(this.props.user.type ==="user" && this.props.user.loggedIn && this.state.userDisplayMenu) {
      return(
        <div className="row">
          <div className="col s7">
              <h1>User Order Here</h1>

            <form>

              <Tabs className='tab-demo z-depth-1' onChange={ this.userHandleTab }>

                <Tab title='Appetizers' active={this.state.userTab.Appetizers}>
                  <Table>
                    <thead>
                      <tr>
                        <th data-field='id'>Food Item</th>
                        <th data-field='name'>Price</th>
                        <th data-field='price'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                        {userAppetizerTab}
                    </tbody>
                  </Table>
                </Tab>

                <Tab title='Mains' active={this.state.userTab.Mains}>
                  <Table>
                    <thead>
                      <tr>
                        <th data-field='id'>Food Item</th>
                        <th data-field='name'>Price</th>
                        <th data-field='price'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                        {userMainsTab}
                    </tbody>
                  </Table>
                </Tab>

                <Tab title='Dessert' active={this.state.userTab.Dessert}>
                  <Table>
                    <thead>
                      <tr>
                        <th data-field='id'>Food Item</th>
                        <th data-field='name'>Price</th>
                        <th data-field='price'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                        {userDessertTab}
                    </tbody>
                  </Table>
                </Tab>

                <Tab title='Drinks' active={this.state.userTab.Drinks}>
                  <Table>
                    <thead>
                      <tr>
                        <th data-field='id'>Food Item</th>
                        <th data-field='name'>Price</th>
                        <th data-field='price'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                        {userDrinksTab}
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
              <Button onClick={e => this.reload(e)} waves='light'>Refresh User</Button>

          </div>
        <button className="btn" onClick={()=>{ this.toggleShowMenu()}}>View Bill</button>
        </div>
      )
    }else{
    return (
    <div className="row">
      <div className="col s5">
      <h1>Table {this.state.tableNumber}</h1>

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
          <Button onClick={e => this.reload(e)} waves='light'>Refresh User</Button>

      </div>
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

const mapDispatchToProps = (dispatch) =>{
  return {
    refreshUser: () => dispatch(reloadUser())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Orders)

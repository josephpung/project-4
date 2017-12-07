import React, { Component } from 'react'
import { Col, Card, Row, Button } from 'react-materialize'
import socket from '../../API/socketAPI'

// hard coded Kitchen order prop data

// when we search for tableOutput from database, it must automatically filter only food that has status
// preparing
let tableOutput = [
  {
    id: 123,
    dishes: [
            {id: 1, category: 'mains', name: 'Cold Cut Trio', price: 5, quantity: '1'},
            {id: 4, category: 'appetizer', name: 'Double Chocolate Cookie', price: 1.5, quantity: '2'},
            {id: 5, category: 'drinks', name: 'Dasani Water', price: 1.5, quantity: '2'},
            {id: 7, category: 'appetizer', name: 'Strawberry Brownie', price: 1.5, quantity: '1'}
    ],
    tableNumber: 1,
    status: 'preparing'
  },
  {
    id: 124,
    dishes: [
            {id: 1, category: 'mains', name: 'Chicken Rice', price: 5, quantity: '2'},
            {id: 4, category: 'appetizer', name: 'Beef Noodles', price: 1.5, quantity: '4'},
            {id: 5, category: 'drinks', name: 'Pineapple Fried Rice', price: 1.5, quantity: '1'},
            {id: 7, category: 'appetizer', name: 'Touch Food', price: 1.5, quantity: '3'}
    ],
    tableNumber: 2,
    status: 'preparing'
  }
]

// when search the item from backend, filter only order with status preparing

export default class Kitchen extends Component {
  constructor (props) {
    super()
    this.state = {
      tableOutput,
      bgColor: 'green accent-1',
      changeColor: true,
      foodReady: [],
      foodDelivered: []
    }
  }

  handleChangeBG (e, dish) {
    const tableNum = e.target.id
    const foodThatIsReady = {}
    foodThatIsReady[`Table ${tableNum}`] = `${dish.quantity} x ${dish.name}`
    let updatingReadyArr = []
    if (!e.target.className.includes('ready')) {
      e.target.className = this.state.bgColor + ' ' + 'ready'
      updatingReadyArr = [...this.state.foodReady, foodThatIsReady ]
    } else {
       updatingReadyArr = [...this.state.foodReady].filter(item => {
         return  JSON.stringify(item) !==  JSON.stringify(foodThatIsReady)
       })
       e.target.className = ''
    }
    this.setState({
      foodReady: updatingReadyArr
    })
  }

  handleFoodIsReady = (e) => {
    const filterFromTwoArrays = [...this.state.foodReady].filter((foodItem) => {
      return ![...this.state.foodDelivered].includes(foodItem)
    })
    const foodDelivered = [...this.state.foodDelivered, ...filterFromTwoArrays]
    // send alert to staff here!
    this.setState({
      foodDelivered: foodDelivered
    })

    // Fire the ready status to the backend socket receiver
    socket.emit('foodready', [...filterFromTwoArrays])


    console.log(filterFromTwoArrays, this.state.foodDelivered);
  }

  handleRemoveOrder(e,foodOrder) {
    console.log(foodOrder)
    const tableToRemove = foodOrder.tableNumber // get table Number
    const copiedArray = [...this.state.foodDelivered]
    // only if the length of Order Dishes match the dishes delivered, then order can be removed
    const objectKeyArray = [] // get object key and compile into an array so that we can compare with string
    copiedArray.map((item) => {
    for (const key in item) {
      objectKeyArray.push(key)
    }
    })
    console.log(objectKeyArray)

    // filter category w/o drinks and get length of dishes ordered
    let numberOfDishesOrdered = foodOrder.dishes.filter(order => order.category !== "drinks" ).length
    // compile in an array the key that match the table that you want to remove (key = 1, table = 1)
    const isTableFoodAllServed = objectKeyArray.filter(eachKey => [eachKey].includes(`Table ${tableToRemove}`))
    // if the length of the array matches the number of dishes array, can remove dishes ordered.
    if (numberOfDishesOrdered === isTableFoodAllServed.length) {
      let filteredArray = [...this.state.tableOutput].filter(order => order.tableNumber !== Number(tableToRemove))
      this.setState({
        tableOutput: filteredArray
      })
    }
  }

  render () {
    const test2 = this.state.tableOutput.map((foodOrder) => {
      return foodOrder.dishes
    })

    var test11 = test2.map((x, index) => {
      var tableNum = this.state.tableOutput[index].tableNumber
      return x.map(dish => {
        if(dish.category !== "drinks") {
          return (
            <div className='' id={tableNum} key={dish.id} onClick={(e) => this.handleChangeBG(e, dish)}>
              {dish.quantity} {dish.name}
            </div>
          )
        }
      })
    })

    var test = this.state.tableOutput.map((foodOrder, index) => {
      return (
        <Col key={foodOrder.id} s={3} >
          <Card className='orange lighten-5 small' textClassName='black-text' title={`Table ${foodOrder.tableNumber.toString()}`}
            actions= {[<Button id={foodOrder.tableNumber} key={foodOrder.id} onClick={this.handleFoodIsReady} waves='light'>Food Ready</Button>]}>
            {test11[index]}
            <div>
		         <Button key={foodOrder.id} id={foodOrder.tableNumber} value={foodOrder} onClick={(e) => this.handleRemoveOrder(e, foodOrder)} waves='light'>Clear Order</Button>
           </div>
          </Card>
        </Col>
      )
    })

    return (
      <div>
        <h2>Kitchen Orders</h2>
        <Row>
          {test}
        </Row>
      </div>
    )
  }
}

// drinks should be send to the bar counter
// send alert to staff when kitchen push order
// notification sent to staff shouldn't be sent again // completed
// only if the length of Order Dishes match the dishes delivered, then order can be removed // completed
// status preparing/cooked // completed


// from delete Order
// find id of Restotable from backend, update status to completed

// bar

// 2 Problems I need to solve
// How do i split the drinks and the kitchen food => by category? or food item?
// How do I check if an order is completed at the bar if kitchen share the same status.
// => if kitchen completes an order

// => Backend: dishes default value is preparing
// => How can frontend talk to the backend to update the status of the dishes.

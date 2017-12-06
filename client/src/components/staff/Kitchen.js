import React, { Component } from 'react'
import { Col, Card, Row, Button } from 'react-materialize'

// hard coded Kitchen order prop data
const tableOutput = [
  {
    id: 123,
    dishes: [
            {id: 1, category: 'mains', name: 'Cold Cut Trio', price: 5, quantity: '1'},
            {id: 4, category: 'appetizer', name: 'Double Chocolate Cookie', price: 1.5, quantity: '2'},
            {id: 5, category: 'drinks', name: 'Dasani Water', price: 1.5, quantity: '2'},
            {id: 7, category: 'appetizer', name: 'Strawberry Brownie', price: 1.5, quantity: '1'}
    ],
    tableNumber: 1,
    status: 'preparing/completed'
  },
  {
    id: 124,
    dishes: [
            {id: 1, category: 'mains', name: 'Chicken Rice', price: 5, quantity: '2'},
            {id: 4, category: 'appetizer', name: 'Beef Noodles', price: 1.5, quantity: '4'},
            {id: 5, category: 'drinks', name: 'Pineapple Fried Rice', price: 1.5, quantity: '1'},
            {id: 7, category: 'appetizer', name: 'Touch Food', price: 1.5, quantity: '3'}
    ],
    tableNumber: 2
  }
]

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
      e.target.className = this.state.bgColor + 'ready'
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
  }

  handleRemoveOrder = (e) => {
    const tableToRemove = e.target.id
    const copiedArray = [...this.state.tableOutput]
    let filteredArray = copiedArray.filter(order => {
      return order.tableNumber !== Number(tableToRemove)
    })
    this.setState({
      tableOutput: filteredArray
    })
  }

  render () {
    var test2 = this.state.tableOutput.map((foodOrder) => {
      return foodOrder.dishes
    })


    var test11 = test2.map((x, index) => {
      var tableNum = this.state.tableOutput[index].tableNumber
      return x.map(dish => {
        return (
          <div className='' id={tableNum} key={dish.id} onClick={(e) => this.handleChangeBG(e, dish)}>
            {dish.quantity} {dish.name}
          </div>
        )
      })
    })

    var test = this.state.tableOutput.map((foodOrder, index) => {
      return (
        <Col key={foodOrder.id} s={3} >
          <Card className='orange lighten-5 small' textClassName='black-text' title={`Table ${foodOrder.tableNumber.toString()}`}
            actions= {[<Button id={foodOrder.tableNumber} onClick={this.handleFoodIsReady} waves='light'>Food Ready</Button>]}>
            {test11[index]}
            <div>
                 <Button id={foodOrder.tableNumber} onClick={this.handleRemoveOrder} waves='light'>Clear Order</Button>
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

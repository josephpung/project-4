import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, CardPanel } from 'react-materialize'


const pizzaExpress = {
  id: 1,
  name: 'PizzaExpress',
  tableQuantity: 25
}
// hard coded order model
const restaurantOrders = [
  {
    _id: 1,
    restaurantid: 1,
    dishes: [1, 2, 3, 4, 5],
    table_number: 8,
    status: 'Done'
  },
  {
    _id: 2,
    restaurantid: 1,
    dishes: [1],
    table_number: 4
  },
  {
    _id: 3,
    restaurantid: 1,
    dishes: [3],
    table_number: 6
  }
]

class Tables extends Component {
  constructor (props) {
    super()
    this.state = {
      name: pizzaExpress.name,
      tableQuantity: pizzaExpress.tableQuantity
    }
  }

  render () {
    // filtering table in restaurants
    const newArr = []
    for (var i = 1; i <= this.state.tableQuantity; i++) {
      newArr.push(i)
    }
    const table = [...newArr].map((restoTable, index) => {
      // color code table that has orders
      var color = 'teal lighten-3 black-text'
      restaurantOrders.find(findTableNumber)
      function findTableNumber (table) {
        if (table.table_number === restoTable) {
          if (table.dishes.length > 0) {
            color = 'red accent-2 black-text'
          }
        }
      }
      return (
        <Col key={index} s={2} className='grid-example'>

          <Link to={"/table/"+{index}}>
          <CardPanel className={color}>
            <span>{restoTable}</span>
          </CardPanel>
        </Link>
        </Col>
      )
    })

    return (
      <div>
        <h1>Select Table</h1>
          <Row>
            {table}
          </Row>
      </div>
    )
  }
}

export default Tables

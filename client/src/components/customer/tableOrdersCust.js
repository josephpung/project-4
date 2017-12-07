import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-materialize'
import axios from 'axios'


// import Payment from '../stripe/Payment'
// <Payment />


class Order extends Component {
  constructor (props) {
    super()
    this.state = {
      orders: []
    }
  }
  componentWillMount(){
    axios.get('/')
  }
  render () {
    const displayOrders = [...this.state.orders].map(order=>{
      return (
        <tr>
          <td>order.name</td>
          <td>Eclair</td>
          <td>$0.87</td>
        </tr>
      )
    })

      return (
        <div>
        <h1 className="center">View Restaurant Menu and Save for future</h1>
        <h5>Table Number: </h5>

        <Table>
        	<thead>
        		<tr>
        			<th data-field="id">Dish Name</th>
        			<th data-field="name">Quantity</th>
        			<th data-field="price">Total Price</th>
        		</tr>
        	</thead>

        	<tbody>
        		<tr>
        			<td>Alvin</td>
        			<td>Eclair</td>
        			<td>$0.87</td>
        		</tr>
        		<tr>
        			<td>Alan</td>
        			<td>Jellybean</td>
        			<td>$3.76</td>
        		</tr>
        	</tbody>
        </Table>
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
        			<td>$22.90</td>
        		</tr>
            <tr>
              <td></td>
              <td className="right-align"><label>GST & Service Charge</label></td>
        			<td>$2.90</td>
        		</tr>
            <tr>
              <td></td>
              <td className="right-align"><label>Total</label></td>
        			<td>$25.90</td>
        		</tr>
        	</tbody>
        </Table>
        <Link to={"/menu"} className="btn black">back to Menu</Link>
        <Link to={"/menu"} className="btn right black">Pay Bill beetch</Link>

        </div>
      )
  }
}

export default Order

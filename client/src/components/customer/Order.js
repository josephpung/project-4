import React, { Component } from 'react'

// import Payment from '../stripe/Payment'
// <Payment />


class Order extends Component {
  constructor (props) {
    super()
    this.state = {
      submitObj: {}
    }
  }
  render () {
    return (
      <div>
      <h1>View Order</h1>

      <ul className="collection">
        <li className="collection-item avatar">
          <span className="title">Name</span>
          <p>Price</p>
          <p>Quanity</p>
        </li>
      </ul>

      </div>
    )
  }
}

export default Order

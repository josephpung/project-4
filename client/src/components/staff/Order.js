import React, { Component } from 'react'

// const restaurantOrders = [
//   {
//     _id: 1,
//     restaurantid: 1,
//     dishes: [1, 2, 3, 4, 5],
//     table_number: 8,
//     status: 'Done'
//   },
//   {
//     _id: 2,
//     restaurantid: 1,
//     dishes: [1],
//     table_number: 4
//   },
//   {
//     _id: 3,
//     restaurantid: 1,
//     dishes: [3],
//     table_number: 6
//   }
// ]

class Order extends Component {
  constructor(){
    super()

    this.state = {
      name: "bob"
    }
  }
  componentDidMount() {
    const { match: { params } } = this.props

    console.log(params)
    // axios.get(`/api/table/${params.restoTableId}`)
    //   .then(({ data: user }) => {
    //     console.log('user', user);
    //
    //     this.setState({ user });
    //   })
  }
  render () {
    return (
      <div>
        <h1>View Order</h1>
        <p>
          asdadkdvknv
        </p>

      </div>

    )
  }
}

export default Order

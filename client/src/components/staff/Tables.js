import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, CardPanel } from 'react-materialize'
import axios from 'axios'
import socket from '../../API/socketAPI'

class Tables extends Component {
  constructor (props) {
    super()
    this.state = {
      tables: []
    }
  }
  componentWillMount(){
    axios.get("/allTables")
    .then(tableData=>{
      this.setState({
        tables: tableData.data

      })
    })
  }

  componentDidMount() {
    socket.on('food ready alert', (data) => {
      // converting data into strings so that can render as alert
      const orders = data.map((foodItem) => {
        let tableNumber = Object.keys(foodItem)
        tableNumber = tableNumber[0].concat(' - ')
        let foodToCollect = Object.values(foodItem)
        let combineString = tableNumber.concat(foodToCollect[0])
        return combineString
      })
      alert(`Collect: ${orders}`)
    })
  }

  render () {

    function isEmpty( obj ) {
      for ( var prop in obj ) {
        return false;
      }
      return true;
    }

    const table = this.state.tables.map(table=>{
        const color = !isEmpty(table.dishes) ? "red black-text": "green black-text"
      return (
        <Col key={table._id} s={2} className='grid-example'>

          <Link to={"/table/"+table._id}>
          <CardPanel className={color} >
            {table.table_number}
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

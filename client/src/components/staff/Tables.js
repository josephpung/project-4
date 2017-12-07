import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, CardPanel } from 'react-materialize'
import axios from 'axios'

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

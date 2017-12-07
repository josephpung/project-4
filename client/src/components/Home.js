import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import axios from 'axios'


class Home extends Component {
  constructor(props) {
  super()


  this.state = {
    allRestaurants: []
  }
}
  componentWillMount(){
    console.log(this.props.user);
    var temp = []
    axios.get('/main')
    .then(response=>{
      temp = response.data.resto
      this.setState({
        allRestaurants: temp
      })
    })
  }
  render () {
    if(this.props.user.type === "staff"){
      return (
        <Redirect to='/tables' />
      )
    }else{
        const allRestaurants = this.state.allRestaurants.map(post => {
          return (

            <div className="col s12 m4" key={post._id}>
              <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                  <Link to={"/restaurant/"+post._id}>
                  <span className="card-title">{ post.name }</span>
                  </Link>
                  <p>{ post.cuisine }</p>
                  <p>{ post.address }</p>
                </div>
              </div>
            </div>

          )
        })
        return (
          <div>
            <h1>Welcome to OmniApp!!</h1>
            <div className="container">
              <div className="row">
                <h2>Restaurant List</h2>
                {
                  allRestaurants
                }
              </div>
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

export default connect(mapStateToProps)(Home)

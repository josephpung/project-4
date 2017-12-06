import React, { Component } from 'react'
import { Link } from 'react-router-dom'



class Home extends Component {
  constructor(props) {
  super()


  this.state = {
    allRestaurants: []
  }
}
  render () {
        const allRestaurants = this.state.allRestaurants.map(post => {
          return (

            <div className="col s12 m4">
              <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                  <Link to="/menu">
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
            <p>This is the main page for users/staff</p>

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


export default Home

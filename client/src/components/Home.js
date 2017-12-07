import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Icon} from 'react-materialize'
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
              <div className="card black">
                <div className="card-content white-text">
                  <Link to={"/restaurant/"+post._id}>
                  <span className="card-title">{ post.name }</span>
                  </Link>
                  <p><Icon tiny>info_outline</Icon> { post.cuisine }</p>
                  <p><Icon tiny>nature_people</Icon> { post.address }</p>
                </div>
              </div>
            </div>

          )
        })
        return (
          <div className="container">
            <h1 className="center">Welcome to OmniApp!!</h1>
            <div>
              <div className="row">
                <h2 className="center">Restaurant List</h2>
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

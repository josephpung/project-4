import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

import { Navbar,NavItem, Dropdown } from 'react-materialize';

import { connect } from 'react-redux'
import { logout } from '../actions/userAction'

class Header extends Component {
  handleClick(e) {
    // e.preventDefault();
    this.props.userLogout()
  }
  render() {

    if(this.props.loggedIn){
      return (
        <Navbar brand='OmniApp' right className="orange">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/qrcode">Scan QR Code</NavLink></li>
          <li><NavLink to="/payment">Payment</NavLink></li>
          <li><NavLink to="/tables">View Tables</NavLink></li>
          <li><NavLink to="/kitchen">View Kitchen</NavLink></li>
          <li><NavLink to="/custmenu">View Menu</NavLink></li>
          <li><NavLink to="/admin_console">Admin</NavLink></li>
          <li><NavLink to="/" onClick={(e)=>{this.handleClick(e)}}>logout</NavLink></li>
          </Navbar>
      )
    }else{
      return (
        <Navbar brand='OmniApp' right className="orange">
          <Dropdown trigger={<NavItem>More</NavItem>} options={{belowOrigin: true,hover: true}}>
        	<NavLink className= "black-text" to="/login">Login</NavLink>
        	<NavLink className= "black-text" to="/login">Login</NavLink>
        	<NavItem className= "black" divider />
        	<NavLink  className= "black-text"to="/login">Login</NavLink>
          </Dropdown>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/login">Login</NavLink></li>
          <li><NavLink to="/register">Register</NavLink></li>
          <li><NavLink to="/qrcode">Scan QR Code</NavLink></li>
          <li><NavLink to="/payment">Payment</NavLink></li>
          <li><NavLink to="/tables">View Tables</NavLink></li>
          <li><NavLink to="/kitchen">View Kitchen</NavLink></li>
          <li><NavLink to="/custmenu">View Menu</NavLink></li>
          <li><NavLink to="/admin_console">Admin</NavLink></li>


          </Navbar>
      )
    }

  }
}
const mapStateToProps = (state) =>{
  return {
    loggedIn: state.users.loggedIn
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    userLogout: () => {
      dispatch(logout())
      // window.location = "/"
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Header)

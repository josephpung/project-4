import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Input } from 'react-materialize'

import { connect } from 'react-redux'
import { login } from '../actions/userAction'
import { withRouter, Redirect } from 'react-router-dom'

class Login extends Component {
  constructor (props) {
    super()

    this.state = {
      submitObj: null,
      userTest: "",
      redirect: false,
      errorMsg: ""
      }
  }
  handleChange(e){
    let tempObj = {...this.state.submitObj}
    tempObj[e.target.name] = e.target.value
     this.setState({
       submitObj: tempObj
     })
  }
  loginUser(){
    if (this.state.submitObj === null || !this.state.submitObj.password === ""){
      alert("Missing fields")
    }else{
      this.props.userLogin(this.state.submitObj)
      if(this.props.user.loggedIn){
        this.setState({
          redirect: true
        })
      }else{
        this.setState({
          errorMsg: "FAILED TO LOGIN"
        })
      }
    }

  }
  componentWillMount(){
      this.setState({
        userTest: this.props.user.name
      })

  }
  render () {
    if (this.state.redirect) {
       return <Redirect to='/'/>;
     }
    const Button = withRouter(({ history }) => (
    <button
      className="btn black"
      type='button'
      onClick={() => { history.push('/'); this.loginUser() }}
    >
      Login
    </button>
  ))
    // console.log("props: ", this.props)
    return (
      <div>

        <h1>Login Page</h1>
        <Row>
          {this.state.errorMsg}
            user: {this.state.userTest}
            <Input type="email" name='email' label="Email" s={12} onChange={(e) => this.handleChange(e)}/>
            <Input type="password" name='password' label="Password" s={12} onChange={(e) => this.handleChange(e)}/>
        </Row>
        <Row className="center">
          <Button />
            {/* <Button onClick={()=>this.loginUser()} className="black" waves='light'>Login</Button> */}
        </Row>

      </div>
    )
  }
  componentWillReceiveProps(nextProps) {
    // console.log("1: ",this.props.user.name);
    // console.log("2: ",nextProps);
  // if (this.props.user.name !== nextProps.name) {
    // If somehow we're sure we can actually be faster than React at this. (not likely)
    this.setState({
      userTest: this.props.user.name
    })
  // }
}
}

const mapStateToProps = (state) =>{
  console.log("state: ", state)
  return {
    user: state.users
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    userLogin: (param) => dispatch(login(param))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Login)

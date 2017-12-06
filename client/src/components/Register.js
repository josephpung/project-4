import React, { Component } from 'react'
import { Row, Input, Button} from 'react-materialize'

class Register extends Component {
  constructor (props) {
    super()
    this.state = {
      submitObj: {}
      }
  }
  handleChange(e){
    let tempObj = {...this.state.submitObj}
      tempObj[e.target.name] = e.target.value
    console.log(e.target.name)
     this.setState({
       submitObj: tempObj
     })
     console.log(this.state.submitObj);
  }
  render () {
    return (
      <div>
        <h1>Registration Page</h1>
        <Row>
		        <Input s={6} name='name'label="Name" onChange={(e) => this.handleChange(e)}/>
            <Input type="email" name='email' label="Email" s={8} onChange={(e) => this.handleChange(e)}/>
        		<Input type="password" name='password' label="Password (Min 8 char)" s={8} onChange={(e) => this.handleChange(e)}/>
        		<Input type="password" name='cfmPassword' label="Confirm Password" s={8} onChange={(e) => this.handleChange(e)} />
        </Row>
        <Row>
            <Button waves='light'>Submit</Button>
        </Row>
      </div>
    )
  }
}

export default Register

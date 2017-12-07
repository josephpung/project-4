import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

class Qrcode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      delay: 1000,
      result: 'No result',
      redirect: false
    }
  }
  handleScan = (data) => {
    if (data) {
      this.setState({
        result: data
      })
    }
  }
  handleError = (err) => {
    console.error(err)
  }

  componentDidUpdate () {
      if(this.state.result !== 'No result'){
        this.setState({ redirect: true })
        console.log('mounted')
      }

    }

  render () {
    const TextArea = withRouter(({ history }) => {
      if(this.state.result !== 'No result' && this.props.user.loggedIn) {
        history.push(this.state.result)
      }else if(this.state.result !== 'No result' && !this.props.user.loggedIn) {
        axios.get(this.state.result)
        .then(resto=>{
          console.log(resto.data);
           history.push(`/restaurant/${resto.data.restaurant_id}`)
        })
        // history.push(this.state.result)
      }
      return(
        <p>
            {this.state.result}
        </p>
        )
    })
      return (
      <div className= "container center" >
        <h1>Scan QR to Start Ordering!</h1>
        <div style={{ width: '300px', margin: 'auto' }}>
          <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />
          <TextArea />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) =>{
  return {
    user: state.users
  }
}
export default connect(mapStateToProps)(Qrcode)

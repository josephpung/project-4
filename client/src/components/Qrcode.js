import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { withRouter} from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

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
      }else if (this.state.result !== 'No result' && !this.props.user.loggedIn) {
        var tableId = this.state.result.split("/")[1]
        axios.get(`/table/${tableId}`)
        .then(result=>{

          history.push(`/restaurant/${result.data.restaurant_id}`)
          })
      }
      return(
        <p>

        </p>
        )
    })
      return (
      <div>
        <h1 className="center">Please scan the QR code provided</h1>
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

import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { withRouter} from 'react-router-dom'

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
      if(this.state.result !== 'No result') {
        history.push(this.state.result)
      }
      return(
        <p>
            {this.state.result}
        </p>
        )
    }
)
      return (
      <div>
        <h1>QR Code Scanner Goes here</h1>
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

export default Qrcode

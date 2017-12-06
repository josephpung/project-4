import React, { Component } from 'react';

import Header from './Header'
import Main from './Main'
import { BrowserRouter as Router } from 'react-router-dom'


class App extends Component {


  render() {
    return (
      <Router >
        <div className="App" >
          <Header />
        <div className="container">
          <Main />
        </div>
        </div>
      </Router>
    )
  }
}


export default App

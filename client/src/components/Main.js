import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import Qrcode from './Qrcode'

import custMenu from './staff/custMenu'
import customerTableOrder from './customer/tableOrdersCust'
import Tables from './staff/Tables'
import tableOrders from './staff/tableOrders'
import Kitchen from './staff/Kitchen'
import Payment from './stripe/Payment'
import AdminConsole from './staff/Adminconsole'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (

  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/register' component={Register}/>
      <Route path='/login' component={Login}/>
      <Route path='/qrcode' component={Qrcode}/>
      <Route path='/tables' component={Tables}/>
      <Route path='/custmenu' component={custMenu}/>
      <Route path='/table/:restoTableId' component={tableOrders}/>
      <Route path='/customer_table_order' component={customerTableOrder}/>
      <Route path='/kitchen' component={Kitchen}/>
      <Route path='/payment' component={Payment}/>
      <Route path='/admin_console' component={AdminConsole}/>
    </Switch>
  </main>
)

export default Main

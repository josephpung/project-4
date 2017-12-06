import { combineReducers } from 'redux'

import users from "./userReducer"
import staff from "./staffReducer"

export default combineReducers({users,staff})

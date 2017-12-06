import { getUser } from './userApi'

const initialState = getUser()

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'loginSuccess':{
      // console.log("payload received ><><",action.payload);
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
        loggedIn: true
      }
    }
    case 'logoutSuccess':{
    return {...state, name:"", email:"", loggedIn: false}
    }
    default :
    return {...state}
  }
}

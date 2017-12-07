import { getUser } from './userApi'

const initialState = getUser()

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'loginSuccess':{
      // console.log("payload received ><><",action.payload);
      return {
        ...state,
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        savedOrder: action.payload.savedOrder,
        type: action.payload.type,
        loggedIn: true
      }
    }
    case 'logoutSuccess':{
    return {...state,id:"", name:"", email:"", savedOrder: [], type:"user", loggedIn: false}
    }
    default :
    return {...state}
  }
}

import axios from 'axios'

export function login(data){
  return function (dispatch){

    axios.post("/login",{
        email: data.email,
        password: data.password
      })
      .then(res=>{
        dispatch({type: res.data.status, payload: res.data.userData})
        console.log("response from server",res.data);
      })
  }
}

export function logout(){
  return function (dispatch){

    axios.get("/logout")
      .then(res=>{
        dispatch({type: res.data.status, payload: res.data.userData})
        console.log("logout response from server",res.data);
      })
  }
}

export function reloadUser(){
  return function (dispatch){
    axios.get("/currentUser")
    .then(res=>{
      dispatch({type: "loginSuccess", payload: res.data.user})
    })

  }

}




// store.dispatch((dispatch)=>{
//   dispatch({type: "FETCH_USERS_START"})
//   axios.post("/login",{
//     email: "goldenpummel@live.com",
//     password: "password"
//   })
//   .then(res=>{
//     dispatch({type: res.data.status, payload: res.data.userData})
//     console.log("logged in", res.data.userData);
//   })
//   .then(()=>{
//     axios.get("logout")
//     .then(res=>{
//       console.log(res.data);
//     })
//
//   })
//   // do something async
//   dispatch({type: "FETCH_"})
//
// })

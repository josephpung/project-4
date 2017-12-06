export const setUser = (user) => {

  if(typeof user === 'object'){
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const getUser = () => {
  const userJSON = localStorage.getItem('user');
  let user = {  name: "xxx",
    email: "",
    loggedIn: false
  };

  try {
    user = JSON.parse(userJSON);
  }catch(e){
    console.log("Error: Cound not decode data from localstorage");
  }

  return typeof user === 'object' ? user : {  name: "xxx",
    email: "",
    loggedIn: false
  };
}

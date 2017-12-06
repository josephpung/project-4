import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import { setUser } from "./reducers/userApi"

store.subscribe(() => {
const state = store.getState();
  setUser(state.users);

})


ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
  <App />
  </BrowserRouter>
  </Provider>, document.getElementById('root'));
registerServiceWorker();

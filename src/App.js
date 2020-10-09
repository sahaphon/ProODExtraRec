import React from 'react';
import { BrowserRouter,  Route, Switch} from "react-router-dom";
import Spinner from 'react-spinkit'
import "./App.scss";

import Login from './login'
import Layout from './containers/Layout'

const loading = () => <div className="animated fadeIn pt-3 text-center"><Spinner name="three-bounce" /></div>
class App extends React.Component {

  render() {

    return (
      // basename='/onlinewholesale_backend' 
      <BrowserRouter> 
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/" name="Login" render={props => <Login  {...props}/> } />    
            <Route path="/main" name="Layout" render={props => <Layout {...props}/>} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;

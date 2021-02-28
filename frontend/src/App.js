import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import Lobby from './views/Lobby';
import Lobbies from './views/Lobbies';
import Config from './Config';
import Landing from './views/Landing';
import Home from './views/Home';
import ClassView from "./views/ClassView";

function App() {
  function onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId());
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail());
    fetch(Config.endpoint('/users'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
  }
  window.onSignIn = onSignIn;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/landing"/>
            </Route>
            <Route path="/test">
              <p>Very poorly styled second page</p>
              <Link to="/">Go back home</Link>
            </Route>
            <Route exact path="/lobbies">
              <Lobbies/>
            </Route>
            <Route exact path="/lobby/:id">
              <Lobby/>
            </Route>
            <Route exact path="/lobby/:lobbyId/class/:classId">
              <ClassView/>
            </Route>
            <Route path="/home" exact>
              <Home/>
            </Route>
            <Route path="/landing">
              <Landing/>
            </Route>
          </Switch>
        </div>
      </Router>
    </MuiPickersUtilsProvider>
  );
}

export default App;

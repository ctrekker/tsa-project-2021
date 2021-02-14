import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Lobby from './views/Lobby';
import Lobbies from './views/Lobbies';
import Config from './Config';
import Landing from './views/Landing';
import Home from './views/Home';

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
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <header className="App-header">
              <div className="g-signin2" data-onsuccess="onSignIn"></div>
              <Link
                className="App-link"
                to="/test"
              >
                Go to another page
              </Link>
            </header>
          </Route>
          <Route path="/test">
            <p>Very poorly styled second page</p>
            <Link to="/">Go back home</Link>
          </Route>
          <Route exact path="/lobbies">
            <Lobbies/>
          </Route>
          <Route path="/lobby/:id">
            <Lobby
              name="Calculus"
              description="Studying the analysis of continuous changes in mathematical functions. More specifically, this lobby refers to differential calculus."
            />
          </Route>
          <Route path="/home" exact>
            <Home/>
          </Route>

          { /* TEST ROUTES */ }
          <Route path="/landing">
            <Landing/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

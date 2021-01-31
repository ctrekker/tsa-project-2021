import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import LobbyPost from './components/LobbyPost';
import Lobby from './views/Lobby';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                <LobbyPost author="Connor Burns" content="This is my post content. It should appear in smaller text below the author"/>
              </p>
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
          <Route path="/lobby/:id">
            <Lobby/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

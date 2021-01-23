import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;

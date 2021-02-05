import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Lobby from './views/Lobby';
import LobbyPost from './components/LobbyPost';
import Config from './Config';
import moment from 'moment';

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
      body: JSON.stringify({
        token
      })
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
          <Route path="/lobby/:id">
            <Lobby/>
          </Route>

          { /* TEST ROUTES */ }
          <Route path="/component/lobbypost">
            <div style={{ width: 400, marginLeft: 100, marginTop: 100 }}>
              <LobbyPost lobbyId={1} id={1} author={{id: 1, name: "Connor Burns"}} createdAt={moment('1/31/2021')} replyCount={4} likes={7} content={`
# Meeting Notes 1/31/2021
We now have the project itself planned with a reasonable degree of granularity, so we must begin development now.

## Frontend / Backend Joint Review
The frontend group built a mockup a couple days ago and we need to review it as a combined group.
### Points to address
* Possible merge of home page and lobby browse page (Ian)
* Ensure we aren't forgetting any sort of table or structure in the backend necessary to make the frontend work
* Flesh out endpoints that the backend group can start to work on (more on this later)

## Git Review - Pull
Changes will need to be pulled to your repository occasionally. Try to do this every time you begin work on your code so you don't fall behind on the changes that others are making.

Either use the terminal and run the following command:
\`\`\`
git pull
\`\`\`
Or, more preferably, use the built-in interface in VS Code.
1. Switch to the version control window on the navbar on the left (looks like a tree branching)
2. Click on the 3 dots in the upper right corner of the sidebar. This will bring up a dropdown with a bunch of options
3. Click on the **Pull** button. If it asks whether you want to fast-forward merge or rebase merge, choose rebase (it should only ask this once if ever)
 
  `}/>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

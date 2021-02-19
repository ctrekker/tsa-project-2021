import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withRouter } from 'react-router-dom';

function Landing({ history }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

  useEffect(() => {
    setTimeout(() => {
      /*global gapi*/
      /*eslint no-undef: "error"*/
      const GoogleAuth = gapi.auth2.getAuthInstance();
      const user = GoogleAuth.currentUser.get();
      const profile = user.getBasicProfile();
      if(profile) {
        history.push('/home');
      }
    }, 1000);
  });

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
        <div style={{flexGrow: 1}}/>
          <div className="g-signin2" data-onsuccess="onSignIn"></div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Landing);

import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function MenuAppBar() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

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

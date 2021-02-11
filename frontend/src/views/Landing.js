import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

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

          <Button variant="contained" onClick={handleClickOpen}>
              Sign in
          </Button>
     
          
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Log in</DialogTitle>
        
        <DialogContent>
          <div className="g-signin2" data-onsuccess="onSignIn"></div>
        
        </DialogContent>
      
   
      </Dialog>

        </Toolbar>
      </AppBar>
    </div>
  );
}

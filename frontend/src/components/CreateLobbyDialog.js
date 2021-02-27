import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from '@material-ui/core';
import React from 'react';

function CreateLobbyDialog({ open, onClose }) {
    function handleClose() {
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a New Lobby</DialogTitle>
            <DialogContent>
                <TextField variant="outlined"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleClose} color="primary" variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateLobbyDialog;

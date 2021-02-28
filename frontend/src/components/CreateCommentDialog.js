import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from '@material-ui/core';
import React, {useRef} from 'react';
import Config from "../Config"

function CreateCommentDialog({ open, onClose, type, lobbyId, classId }) {
    function handleClose() {

        fetch(Config.endpoint('/lobbies/' + lobbyId + '/classes/' + classId + '/comments/'), {
            method: 'POST',
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({
                content: content.current.value,
                highlighted: type == "Announcement" ? "true" : "false"
            })
        }).then(res => res.json())
        .then(res => {
            console.log(res)
        }).catch(err => {
            if(err) console.log(err);
        });
        onClose();
    }
    const content = useRef()
    return (
        <Dialog open={open} onClose={onClose} fullWidth = "xl">
            <DialogTitle>Create a New {type}</DialogTitle>
            <DialogContent>
                <TextField inputRef={content} variant="outlined" fullWidth = "xl" style = {{minHeight: "30vh"}} fullHeight = "sm"/>
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

export default CreateCommentDialog;

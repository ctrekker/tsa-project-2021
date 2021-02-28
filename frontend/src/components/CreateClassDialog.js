import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import React, { useRef, useState, useEffect } from 'react';
import Config from '../Config';
import FlexCenter from '../components/FlexCenter';
import moment from 'moment';
import { useParams, withRouter } from 'react-router-dom';

function CreateClassDialog({ open, onClose }) {
    const [nameError, setNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [meetingLinkError, setMeetingLinkError] = useState(false);

    const { id } = useParams();
    
    const className = useRef();
    const classDescription = useRef();
    const classMeetingLink = useRef();
    const classMeetingDate = useRef();
    const classMeetingTime = useRef();

    function handleCreate() {
        const name = className.current.value;
        const description = classDescription.current.value;
        const meetingLink = classMeetingLink.current.value;
        const meetingDate = classMeetingDate.current.value;
        const meetingTime = classMeetingTime.current.value;

        const d = new Date(`${meetingDate} ${meetingTime}`);
        
        const ne = !name || name.length === 0;
        const de = !description || description.length === 0;
        const dateBad = meetingDate === null;
        const timeBad = meetingTime === null;
        if(ne) setNameError(true);
        if(de) setDescriptionError(true);

        if(ne || de || dateBad || timeBad) return;

        fetch(Config.endpoint(`/lobbies/${id}/classes`), {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name, description, scheduled_for: d.toISOString(), meeting_link: meetingLink
            })
        }).then(res => res.json())
        .then(res => {
            onClose();
        }).catch(err => {
            if(err) console.log(err);
        });
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a New Class</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
                <TextField required inputRef={className} label="Class Name" error={nameError} helperText="This is what will appear at the top of the lobby"/>
                <TextField inputRef={classDescription} multiline label="Description" error={descriptionError} helperText="A short description of what specifically this lobby is for"/>
                <TextField inputRef={classMeetingLink} label="Meeting Link" error={meetingLinkError} helperText={meetingLinkError}/>
                
                <span style={{marginTop: 15, marginBottom: 5, color: '#00000099'}}>Meeting Date and Time</span>
                <FlexCenter>
                    <input type="date" ref={classMeetingDate}/>
                    <input type="time" ref={classMeetingTime}/>
                </FlexCenter>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCreate} color="primary" variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default withRouter(CreateClassDialog);

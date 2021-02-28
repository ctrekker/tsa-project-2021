import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import React, { useRef, useState, useEffect } from 'react';
import Config from '../Config';

function CreateLobbyDialog({ open, onClose }) {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(0);

    const [nameError, setNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);

    const lobbyName = useRef();
    const lobbyDescription = useRef();

    useEffect(() => {
        fetch(Config.endpoint('/categories/'), {
            method: 'GET'
        }).then(res => res.json())
        .then(res => {
            setCategories(res);
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [setCategories]);

    function handleCreate() {
        const name = lobbyName.current.value;
        const description = lobbyDescription.current.value;
        
        const ne = !name || name.length === 0;
        const de = !description || description.length === 0;
        const ce = category === 0;
        if(ne) setNameError(true);
        if(de) setDescriptionError(true);
        if(ce) setCategoryError(true);

        if(ce || de || ne) return;

        fetch(Config.endpoint('/lobbies/'), {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name, category, description
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
            <DialogTitle>Create a New Lobby</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
                <TextField required inputRef={lobbyName} label="Lobby Name" error={nameError} helperText="This is what will appear at the top of the lobby"/>
                <TextField inputRef={lobbyDescription} multiline label="Description" error={descriptionError} helperText="A short description of what specifically this lobby is for"/>
                <div style={{paddingTop: 15}}/>
                <FormControl>
                    <InputLabel id="create-lobby-category">Category</InputLabel>
                    <Select labelId="create-lobby-category" error={categoryError} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <MenuItem value={0}>None</MenuItem>
                        {categories.map(category => (
                            <MenuItem value={category.id}>{category.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
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

export default CreateLobbyDialog;

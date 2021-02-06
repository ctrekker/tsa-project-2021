import React from 'react';
import { Container, Divider, Grid, Typography, IconButton, MenuItem, MenuList, ListItemText, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import FlexCenter from '../components/FlexCenter';
import './Lobby.css';

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.common.white,
        },
        },
    },
}))(MenuItem);

const categories = ['Math', 'Science', 'History', 'English', 'Foreign Language', 'Education', 'Practical Skills'];
const lobbies = [
    { name: 'Algebra' },
    { name: 'Geometry' },
    { name: 'Calculus' },
    { name: 'Linear Algebra' },
    { name: 'Complex Analysis' },
    { name: 'Combinatorics' },
    { name: 'Topology' },
    { name: 'Biology' },
    { name: 'Chemistry' },
    { name: 'Physics' },
    { name: 'Environmental Science' },
    { name: 'United States History' },
    { name: 'World History' },
    { name: 'European History' }
]

// TEMPORARY LobbyPreview COMPONENT
const _LobbyPreview = ({ name }) => ((
    <Paper style={{padding: 20, height: 150}}>
        <Typography variant="h6">{name}</Typography>
    </Paper>
));

export default function Lobbies() {
    return (
        <Container maxWidth="lg" style={{marginTop: 50}}>
            <FlexCenter>
                <Typography variant="h4">Lobbies</Typography>
                <div style={{flexGrow: 1}}/>
                <IconButton ><AddIcon fontSize="large"/></IconButton>
            </FlexCenter>
            <Divider/>
            <Grid container>
                <Grid item sm="6" md="4" lg="3" style={{borderRight: '1px solid lightgrey'}}>
                    <MenuList>
                        <StyledMenuItem><ListItemText primary="All"/></StyledMenuItem>
                        {categories.map((cat, i) => ((
                            <StyledMenuItem key={i}><ListItemText primary={cat}/></StyledMenuItem>
                        )))}
                    </MenuList>
                </Grid>
                <Grid item sm="6" md="8" lg="9">
                    <Grid container spacing={3} style={{padding: 20}}>
                        {lobbies.map((lobby, i) => ((
                            <Grid item xs="12" sm="6" md="4">
                                <_LobbyPreview {...lobby}/>
                            </Grid>
                        )))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import './ClassView.css';
import Config from "../Config"
import { Typography, Grid, Container, Divider, Button, Collapse, IconButton } from "@material-ui/core";
import FlexCenter from '../components/FlexCenter';
import AddIcon from '@material-ui/icons/Add';

export default function ClassView(props) {
    const { lobbyId, classId } = useParams();
    
    const [lobbyClass, setLobbyClass] = useState({});
    const [descriptionExpanded, setDescriptionExpanded] = useState(true);

    function handleRegisterUnregister() {
        // TODO: Integrate!!!
    }

    function handleAddAnnouncement() {
        // TODO: Integrate!!!
    }
    function handleAddComment() {
        // TODO: Integrate!!!
    }

    useEffect(() => {
        function handleScroll(e) {
            if(window.scrollY > 50 && descriptionExpanded) {
                setDescriptionExpanded(false);
            }
            else if(window.scrollY <= 50 && !descriptionExpanded) {
                setDescriptionExpanded(true);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [descriptionExpanded, setDescriptionExpanded]);

    useEffect(() => {
        fetch(Config.endpoint('/lobbies/' + lobbyId + '/classes/' + classId + '/'), {
            method: 'GET'
        }).then(res => res.json())
        .then(res => {
            setLobbyClass(res);
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [lobbyId, classId]);

    console.log(lobbyClass);

    return (
        <Container maxWidth="md" style={{marginTop: 20}}>
            <div style={{position: 'sticky', top: -10, paddingTop: 10, zIndex: 100, background: 'white'}}>
                <FlexCenter>
                    <div>
                        <Typography variant="h4">{lobbyClass.name}</Typography>
                        <Collapse in={descriptionExpanded}>
                            <Typography variant="body1" color="textSecondary">{lobbyClass.description}</Typography>
                        </Collapse>
                    </div>
                    <div style={{flexGrow: 1}}/>
                    <Button onClick={handleRegisterUnregister} variant="contained" color={lobbyClass.is_member === 0 ? 'primary' : 'secondary'} size={lobbyClass.is_member === 0 ? 'large' : 'small'}>{ lobbyClass.is_member === 0 ? 'Register' : 'Unregister' }</Button>
                </FlexCenter>
                <Divider/>
            </div>
                
            <div className="content-section">
                <div>
                    <FlexCenter>
                        <Typography variant="h5">Announcements</Typography>
                        <div style={{flexGrow: 1}}/>
                        <IconButton onClick={handleAddAnnouncement}><AddIcon fontSize="large"/></IconButton>
                    </FlexCenter>
                    <Divider/>
                    <div>

                    </div>
                </div>
                <div>
                    <FlexCenter>
                        <Typography variant="h5">Discussion</Typography>
                        <div style={{flexGrow: 1}}/>
                        <IconButton onClick={handleAddComment}><AddIcon fontSize="large"/></IconButton>
                    </FlexCenter>
                    <Divider/>
                    <div>

                    </div>
                </div>
            </div>
        </Container>
    )
}
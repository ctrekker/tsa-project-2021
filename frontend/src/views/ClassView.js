import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import './ClassView.css';
import Config from "../Config"
import { Typography, Grid, Container, Divider, Button, Collapse, IconButton } from "@material-ui/core";
import FlexCenter from '../components/FlexCenter';
import AddIcon from '@material-ui/icons/Add';
import ClassComment from "../components/ClassComment";
import CreateCommentDialog from "../components/CreateCommentDialog";

export default function ClassView(props) {
    const [addCommentOpen, setAddCommentOpen] = useState(false);
    const [addAnnouncementOpen, setAddAnnouncementOpen] = useState(false);

    const { lobbyId, classId } = useParams();
    
    const [lobbyClass, setLobbyClass] = useState({});
    const [descriptionExpanded, setDescriptionExpanded] = useState(true);

    function handleRegisterUnregister() {
        fetch(Config.endpoint('/lobbies/' + lobbyId + '/classes/' + classId + '/' + (lobbyClass.is_member == 0 ? 'join' : 'leave') + '/'), {
            method: 'POST'
        }).then(res => res.json())
        .then(res => {
            setLobbyClass(res)
            console.log(lobbyClass)
        }).catch(err => {
            if(err) console.log(err);
        });    
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

    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetch(Config.endpoint('/lobbies/' + lobbyId + '/classes/' + classId + '/comments/?highlighted=true'), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setAnnouncements(res);
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [addAnnouncementOpen, setAnnouncements]);

    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch(Config.endpoint('/lobbies/' + lobbyId + '/classes/' + classId + '/comments/'), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setComments(res);
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [addCommentOpen, addAnnouncementOpen, setComments]);

    return (
        <div>
            <Container maxWidth="md" style={{marginTop: 20}}>
                <div style={{position: 'sticky', top: 60, paddingTop: 10, marginBottom: 10, zIndex: 5, background: 'white', marginLeft: -10, marginRight: -10}}>
                    <FlexCenter>
                        <div>
                            <Typography variant="h4">{lobbyClass.name}</Typography>
                            <Collapse in={descriptionExpanded}>
                                <Typography variant="body1" color="textSecondary">{lobbyClass.description}</Typography>
                            </Collapse>
                        </div>
                        <div style={{flexGrow: 1}}/>
                        <Button onClick={handleRegisterUnregister} variant="contained" color={lobbyClass.is_member === 0 ? 'primary' : 'secondary'} size={lobbyClass.is_member === 0 ? 'large' : 'small'} style = {{margin:10}}>{ lobbyClass.is_member === 0 ? 'Register' : 'Unregister' }</Button>
                    </FlexCenter>
                    <Divider/>
                </div>
                    
                <div className="content-section" style = {{marginTop: 50}}>
                    <div>
                        <FlexCenter>
                            <Typography variant="h5">Announcements</Typography>
                            <div style={{flexGrow: 1}}/>
                            <IconButton onClick={()=>setAddAnnouncementOpen(true)}><AddIcon fontSize="large"/></IconButton>
                        </FlexCenter>
                        <Divider/>
                        <div>
                            {announcements.map((announcement, i) => {
                                announcement.highlighted = false;
                                return (
                                    <Grid item>
                                        <ClassComment {...announcement}/>
                                    </Grid>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <FlexCenter>
                            <Typography variant="h5">Discussion</Typography>
                            <div style={{flexGrow: 1}}/>
                            <IconButton onClick={()=>setAddCommentOpen(true)}><AddIcon fontSize="large"/></IconButton>
                        </FlexCenter>
                        <Divider/>
                        <div>
                            {comments.map((comment, i) => ((
                                    <Grid item>
                                        <ClassComment {...comment}/>
                                    </Grid>
                            )))}
                        </div>
                    </div>
                </div>
                <CreateCommentDialog open={addCommentOpen} onClose={() => setAddCommentOpen(false)} type = "Comment" lobbyId = {lobbyId} classId = {classId}/>
                <CreateCommentDialog open={addAnnouncementOpen} onClose={() => setAddAnnouncementOpen(false)} type = "Announcement" lobbyId = {lobbyId} classId = {classId}/>
            </Container>
        </div>
    )
}
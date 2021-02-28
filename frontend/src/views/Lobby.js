import React, { useState, useEffect } from 'react';
import { Container, Divider, Grid, Typography, IconButton, MenuItem, MenuList, ListItemText, Collapse, Button } from '@material-ui/core';
import { useParams, withRouter } from 'react-router-dom';
import ClassPreview from '../components/ClassPreview';
import FlexCenter from '../components/FlexCenter';
import LobbyPost from '../components/LobbyPost';
import './Lobby.css';
import moment from 'moment';
import Config from '../Config';
import AddIcon from '@material-ui/icons/Add';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CreateClassDialog from '../components/CreateClassDialog';

const sampleContent = `
# Meeting Notes 1/31/2021
We now have the project itself planned with a reasonable degree of granularity, so we must begin development now.

## Frontend / Backend Joint Review
The frontend group built a mockup a couple days ago and we need to review it as a combined group.
### Points to address
* Possible merge of home page and lobby browse page (Ian)
* Ensure we aren't forgetting any sort of table or structure in the backend necessary to make the frontend work
* Flesh out endpoints that the backend group can start to work on (more on this later)

## Git Review - Pull
Changes will need to be pulled to your repository occasionally. Try to do this every time you begin work on your code so you don't fall behind on the changes that others are making.

Either use the terminal and run the following command:
\`\`\`
git pull
\`\`\`
Or, more preferably, use the built-in interface in VS Code.
1. Switch to the version control window on the navbar on the left (looks like a tree branching)
2. Click on the 3 dots in the upper right corner of the sidebar. This will bring up a dropdown with a bunch of options
3. Click on the **Pull** button. If it asks whether you want to fast-forward merge or rebase merge, choose rebase (it should only ask this once if ever)
`

function Lobby({ history }) {
    const [descriptionExpanded, setDescriptionExpanded] = useState(true);
    const [lobby, setLobby] = useState({});
    const [lobbyPosts, setLobbyPosts] = useState([]);
    const [lobbyClasses, setLobbyClasses] = useState([]);
    const [author, setAuthor] = useState({});
    const [lobbyVersion, setLobbyVersion] = useState(0);
    const [lobbyPostsVersion, setLobbyPostsVersion] = useState(0);
    const [lobbyClassesVersion, setLobbyClassesVersion] = useState(0);

    const [createClassOpen, setCreateClassOpen] = useState(false);
    const [createPostOpen, setCreatePostOpen] = useState(false);

    const { name='', description='Loading...' } = lobby;
    let { id } = useParams();

    const lobbyPostsLeft = []; ///lobbyPosts.slice(0, Math.floor(lobbyPosts.length / 2))
    const lobbyPostsRight = []; ///lobbyPosts.slice(Math.floor(lobbyPosts.length / 2), lobbyPosts.length)
    for(let i=0; i<lobbyPosts.length; i++) {
        (i % 2 === 1 ? lobbyPostsRight : lobbyPostsLeft).push(lobbyPosts[i]);
    }

    function handleJoinLeave() {
        fetch(Config.endpoint(`/lobbies/${id}/${lobby.is_member === 0 ? 'join' : 'leave'}`), {
            method: 'POST'
        })
            .then(res => res.json())
            .then(res => {
                setLobbyVersion(lobbyVersion + 1);
            })
            .catch(res => {
                console.log(res);
            });
    }
    function handleCreateClassClose() {
        setLobbyClassesVersion(lobbyClassesVersion + 1);
        setCreateClassOpen(false);
    }
    function handleCreatePost() {
        setCreatePostOpen(!createPostOpen);
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
        fetch(Config.endpoint(`/lobbies/${id}`), {
            method: 'GET'
        }).then(res => res.json())
        .then(res => {
            setLobby(res);
        }).catch(err => {
            console.log(err);
        });
    }, [id, lobbyVersion]);
    useEffect(() => {
        fetch(Config.endpoint(`/lobbies/${id}/posts/`), {
            method: 'GET'
        }).then(res => res.json())
        .then(res => {
            setLobbyPosts(res);
        }).catch(err => {
            console.log(err);
        });
    }, [id, lobbyPostsVersion]);
    useEffect(() => {
        fetch(Config.endpoint(`/lobbies/${id}/classes/`), {
            method: 'GET'
        }).then(res => res.json())
        .then(res => {
            setLobbyClasses(res);
        }).catch(err => {
            console.log(err);
        });
    }, [id, lobbyClassesVersion]);
    useEffect(() => {
        fetch(Config.endpoint(`/users/`), {
            method: 'GET'
        }).then(res => res.json())
        .then(res => {
            setAuthor(res);
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <Container maxWidth="lg" style={{marginTop: 50}}>
            <div style={{position: 'sticky', top: 60, paddingTop: 10, zIndex: 3, background: 'white'}}>
                <FlexCenter style={{marginBottom: 10}}>
                    <div>
                        <Typography variant="h4">{name}</Typography>
                        <Collapse in={descriptionExpanded}>
                            <Typography variant="body1" color="textSecondary">{description}</Typography>
                        </Collapse>
                    </div>
                    <Button onClick={handleCreatePost} variant="contained" color="primary" style={{marginLeft: 25}}><PostAddIcon fontSize="small"/>&nbsp;Write Post</Button>
                    <div style={{flexGrow: 1}}/>
                    <Button onClick={handleJoinLeave} variant="contained" color={lobby.is_member === 0 ? 'primary' : 'secondary'} size={lobby.is_member === 0 ? 'large' : 'small'}>{ lobby.is_member === 0 ? 'Join' : 'Leave' }</Button>
                </FlexCenter>
                <Divider/>
            </div>
                
            <Grid container>
                <Grid item xs="8">
                    <Grid container spacing={3} style={{padding: 15}}>
                        <Grid item xs="6">
                            <Collapse in={createPostOpen}>
                                <LobbyPost
                                    editable
                                    lobbyId={id}
                                    author={author}
                                    onPost={() => {
                                        setLobbyPostsVersion(lobbyPostsVersion + 1);
                                        setCreatePostOpen(false);
                                    }}
                                    onCancel={() => setCreatePostOpen(false)}/>
                            </Collapse>
                            {lobbyPostsLeft.map(post => (
                                <LobbyPost
                                    lobbyId={id}
                                    id={post.id}
                                    author={{id: post.author_id, name: post.author_name, picture: post.author_picture}}
                                    createdAt={moment(post.created_at)}
                                    replyCount={post.reply_count}
                                    likes={post.likes}
                                    content={post.content || ''}
                                    onLike={() => setLobbyPostsVersion(lobbyPostsVersion + 1)}/>
                            ))}
                            {lobbyPostsLeft.length === 0 && (
                                <i>There are no posts in this lobby yet. Be the first!</i>
                            )}
                        </Grid>
                        <Grid item xs="6">
                            {lobbyPostsRight.map(post => (
                                <LobbyPost
                                    lobbyId={id}
                                    id={post.id}
                                    author={{id: post.author_id, name: post.author_name, picture: post.author_picture}}
                                    createdAt={moment(post.created_at)}
                                    replyCount={post.reply_count}
                                    likes={post.likes}
                                    content={post.content || ''}/>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs="4" style={{borderLeft: '1px solid lightgrey'}}>
                    <div style={{position: 'sticky', top: 120, padding: '10px'}}>
                        <FlexCenter style={{marginBottom: 15}}>
                            <Typography variant="h5">Upcoming Classes</Typography>
                            <div style={{flexGrow: 1}}/>
                            <Button size="small" variant="contained" color="primary" onClick={() => setCreateClassOpen(true)}><AddIcon fontSize="small"/>&nbsp;Create a Class</Button>
                        </FlexCenter>
                        <Grid container spacing={2}>
                            {lobbyClasses.map(lobbyClass => (
                                <Grid item xs="12">
                                    <ClassPreview
                                        onClick={() => history.push(`/lobby/${id}/class/${lobbyClass.id}`)}
                                        name={lobbyClass.name}
                                        instructor_name={lobbyClass.instructor_name}
                                        rating={lobbyClass.rating && `${lobbyClass.rating.toString().slice(0, 3)}/5`}
                                        scheduledFor={moment(lobbyClass.scheduled_for)}/>
                                </Grid>
                            ))}
                            {lobbyClasses.length === 0 && (
                                <div style={{textAlign: 'center', marginTop: 10, width: '100%'}}>
                                    <i>No classes yet</i>
                                </div>
                            )}
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            <CreateClassDialog open={createClassOpen} onClose={handleCreateClassClose}/>
        </Container>
    );
}

export default withRouter(Lobby);

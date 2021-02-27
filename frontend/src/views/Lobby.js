import React, { useState, useEffect } from 'react';
import { Container, Divider, Grid, Typography, IconButton, MenuItem, MenuList, ListItemText, Collapse } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import ClassPreview from '../components/ClassPreview';
import LobbyPost from '../components/LobbyPost';
import './Lobby.css';
import moment from 'moment';
import Config from '../Config';

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

export default function Lobby() {
    const [descriptionExpanded, setDescriptionExpanded] = useState(true);
    const [lobby, setLobby] = useState({});
    const [lobbyPosts, setLobbyPosts] = useState([]);
    const { name='', description='Loading...' } = lobby;
    let { id } = useParams();

    const lobbyPostsLeft = lobbyPosts.slice(0, Math.ceil(lobbyPosts.length / 2));
    const lobbyPostsRight = lobbyPosts.slice(Math.ceil(lobbyPosts.length / 2), lobbyPosts.length);

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
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setLobby(res);
        }).catch(err => {
            if(err) console.log(err);
        });

        fetch(Config.endpoint(`/lobbies/${id}/posts/`), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setLobbyPosts(res);
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [id]);

    return (
        <Container maxWidth="lg" style={{marginTop: 20}}>
            <div style={{position: 'sticky', top: -10, paddingTop: 10, zIndex: 100, background: 'white'}}>
                <Typography variant="h4">{name}</Typography>
                <Collapse in={descriptionExpanded}>
                    <Typography variant="body1" color="textSecondary">{description}</Typography>
                </Collapse>
                <Divider/>
            </div>
            <Grid container>
                <Grid item xs="8">
                    <Grid container spacing={3} style={{padding: 15}}>
                        <Grid item xs="6">
                            {lobbyPostsLeft.map(post => (
                                <LobbyPost
                                    lobbyId={id}
                                    id={post.id}
                                    author={{id: post.author_id, name: post.author_name, picture: post.author_picture}}
                                    createdAt={moment(post.created_at)}
                                    replyCount={post.reply_count}
                                    likes={post.likes}
                                    content={post.content || ''}/>
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
                    <div style={{position: 'sticky', top: 50, padding: '10px'}}>
                        <Grid container spacing={2}>
                            <Grid item xs="12">
                                <ClassPreview onClick={() => alert('clicked!')} title="Basics of Derivatives" author="Connor Burns" rating={'4.3/5'} scheduledFor={moment('2/8/2021 7:30')} date="Feb 8th" time="7:30 AM"/>
                            </Grid>
                            <Grid item xs="12">
                                <ClassPreview title="Mistakes in Calculus 10th Edition" author="Todd Mortley" rating={'6.28/5'} scheduledFor={moment('2/11/2021 6:00')} date="Feb 11th" time="6:00 AM"/>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}

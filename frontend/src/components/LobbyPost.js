import React, { useState, useRef } from 'react';
import './LobbyPost.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';
import { IconButton, Link, TextField, Button } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ProfilePicture from './ProfilePicture';
import {Link as RouterLink} from 'react-router-dom';
import Config from '../Config';

const IconStat = ({ icon, stat, onClick }) => ((
    <div style={{display: 'flex', justifyContent: 'center'}}>
        <IconButton onClick={onClick}>{icon}</IconButton>
        <Typography variant="body1" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>{stat > 0 ? stat : null}</Typography>
    </div>
));

export default function LobbyPost({ lobbyId, id, author, createdAt, content, editable=false, onLike=()=>{}, onCancel=()=>{}, onPost=()=>{}, replyCount=0, likes=0, maxContentLength=250 }) {
    const [expandedContent, setExpandedContent] = useState(false);
    const [postError, setPostError] = useState('');
    const postContent = useRef();

    function handlePostLike() {
        /* This is where we call the backend endpoint */
        fetch(Config.endpoint(`/lobbies/${lobbyId}/posts/${id}/like`), {
            method: 'POST'
        })
            .then(() => {
                onLike();
            });
    }

    function handlePost() {
        if(!postContent.current.value || postContent.current.value.length === 0) {
            setPostError('You must write a post first');
            return;
        }

        fetch(Config.endpoint(`/lobbies/${lobbyId}/posts`), {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                content: postContent.current.value
            })
        })
            .then(() => {
                onPost();
                postContent.current.value = '';
            })
            .catch(err => {
                setPostError(err.message);
            });
    }

    return (
        <Card style={{marginBottom: 25}}>
            <CardContent>
                <RouterLink className="userLink" to={`/user/${author.id}`} style={{display: 'flex', alignItems: 'center'}}>
                    <ProfilePicture url={author.picture || 'https://lh3.googleusercontent.com/a-/AOh14GjGp4Umv1QrrFtqqOHUbSbMAulx7XhYJh_Q4esNfA=s96-c'}/>
                    <div style={{marginLeft: 10}}>
                        <Typography variant="h6">{author.name}</Typography>
                        {!editable && <Typography variant="body2" color="textSecondary">{createdAt.fromNow()}</Typography>}
                    </div>
                </RouterLink>
                
                {editable && (
                    <TextField multiline fullWidth autoFocus placeholder="Start your post here..." inputRef={postContent} onChange={(e) => {
                        if(postError.length > 0) setPostError('');
                    }}/>
                )}
                {!editable && (
                    <Typography variant="body2" component="div" style={{textAlign: 'left'}}>
                        <ReactMarkdown style={{display: 'inline'}}>
                            {expandedContent ? content : (content || '').substring(0, maxContentLength)}
                        </ReactMarkdown>
                        {content && content.length > maxContentLength &&
                            <Link href="javascript:;" onClick={() => setExpandedContent(!expandedContent)}>{expandedContent ? 'less...' : 'more...'}</Link>
                        }
                    </Typography>
                )}

                {/* CLASS COMPONENT WILL EVENTUALLY BE INSTANTIATED HERE */}
                {/* <ClassPreview .../> */}
            </CardContent>
            <CardActions style={{display: 'flex', justifyContent: 'flex-end', margin: '0 10px'}}>
                {!editable && <>
                    {replyCount > 0 && <Link href="#" onClick={() => {}}>See {replyCount} replies...</Link>}
                    <div style={{flexGrow: 1}}/>
                    <IconStat icon={<ThumbUpIcon/>} stat={likes} onClick={handlePostLike}/>
                </>}
                {editable && <>
                    <span style={{color: 'red', marginRight: 15}}>{postError}</span>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handlePost}>Post!</Button>
                </>}
            </CardActions>
        </Card>
    );
}

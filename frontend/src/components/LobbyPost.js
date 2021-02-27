import React, { useState } from 'react';
import './LobbyPost.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';
import { IconButton, Link } from '@material-ui/core';
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

export default function LobbyPost({ lobbyId, id, author, createdAt, content, replyCount=0, likes=0, maxContentLength=250 }) {
    const [expandedContent, setExpandedContent] = useState(false);

    function handlePostLike() {
        /* This is where we call the backend endpoint */
        fetch(Config.endpoint(`/lobbies/${lobbyId}/posts/${id}/like`), {
            method: 'POST',
            credentials: 'include'
        })
            .then(() => {
                // TODO: Perform state update on parent component (bad practice I know)
            });
    }

    return (
        <Card style={{marginBottom: 25}}>
            <CardContent>
                <RouterLink className="userLink" to={`/user/${author.id}`}>
                    <ProfilePicture url={author.picture || 'https://lh3.googleusercontent.com/a-/AOh14GjGp4Umv1QrrFtqqOHUbSbMAulx7XhYJh_Q4esNfA=s96-c'}/>
                    <div style={{marginLeft: 10}}>
                        <Typography variant="h6">{author.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{createdAt.fromNow()}</Typography>
                    </div>
                </RouterLink>
                
                <Typography variant="body2" component="div" style={{textAlign: 'left'}}>
                    <ReactMarkdown style={{display: 'inline'}}>
                        {expandedContent ? content : content.substring(0, maxContentLength)}
                    </ReactMarkdown>
                    {content.length > maxContentLength &&
                        <Link href="#" onClick={() => setExpandedContent(!expandedContent)}>{expandedContent ? 'less...' : 'more...'}</Link>
                    }
                </Typography>

                {/* CLASS COMPONENT WILL EVENTUALLY BE INSTANTIATED HERE */}
                {/* <ClassPreview .../> */}
            </CardContent>
            <CardActions style={{display: 'flex', justifyContent: 'flex-end', margin: '0 10px'}}>
                {replyCount > 0 && <Link href="#" onClick={() => {}}>See {replyCount} replies...</Link>}
                <div style={{flexGrow: 1}}/>
                <IconStat icon={<ThumbUpIcon/>} stat={likes} onClick={handlePostLike}/>
            </CardActions>
        </Card>
    );
}

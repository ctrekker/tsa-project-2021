import React, { useState } from 'react';
import {Card, CardContent, Typography, Link} from "@material-ui/core"
import {Link as RouterLink} from 'react-router-dom';
import ProfilePicture from "./ProfilePicture"
import moment from "moment"
import ReactMarkdown from 'react-markdown';

function ClassComment({ name, picture, content, user_id, highlighted, created_at, maxContentLength = 250 }) {
    const [expandedContent, setExpandedContent] = useState(false);
    
    return (
        <Card style={{marginBottom: 25, ...(highlighted ? {backgroundColor: '#f7e6af3b'} : {})}}>
            <CardContent>
                <RouterLink className="userLink" to={`/user/${user_id}`}>
                    <ProfilePicture url={picture || 'https://lh3.googleusercontent.com/a-/AOh14GjGp4Umv1QrrFtqqOHUbSbMAulx7XhYJh_Q4esNfA=s96-c'}/>
                    <div style={{marginLeft: 10}}>
                        <Typography variant="h6">{name}</Typography>
                        <Typography variant="body2" color="textSecondary">{moment(created_at).fromNow()}</Typography>
                    </div>
                </RouterLink>
            
                <Typography variant="body1" component="div" style={{textAlign: 'left'}}>
                    <ReactMarkdown style={{display: 'inline'}}>
                        {expandedContent ? content : content.substring(0, maxContentLength)}
                    </ReactMarkdown>
                    {content.length > maxContentLength &&
                        <Link href="#" onClick={() => setExpandedContent(!expandedContent)}>{expandedContent ? 'less...' : 'more...'}</Link>
                    }
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ClassComment;
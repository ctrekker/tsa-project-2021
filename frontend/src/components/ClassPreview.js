import { Card, CardActionArea, Typography } from '@material-ui/core';
import React from 'react'
import './ClassPreview.css';
import moment from 'moment';
import {Link as RouterLink} from 'react-router-dom';
import './LobbyPost.css';


export default function ClassPreview(props) {
    const {
        class_name,
        instructor_name,
        class_rating,
        scheduled_for,
        class_id,
        lobby_id
    } = props;

    return (
        <Card>
            <RouterLink className="userLink" to={`lobby/${lobby_id}/class/${class_id}`}>
                <CardActionArea>
                    <div className="container">
                        <div className="left">
                            <Typography variant="subtitle1" className="ttext" style={{marginTop: 0}}>{class_name}</Typography>
                            <Typography variant="p" id="author">by {instructor_name} ({class_rating})</Typography>
                        </div>

                        <div style={{flexGrow: 1}}/>

                        <div className="right">
                            <Typography variant="p" id="text" color="textSecondary">Scheduled For:</Typography>
                            <Typography variant="subtitle2" className="date">{moment(scheduled_for).format('MMM Do')}</Typography>
                            <Typography variant="subtitle2" className="date">{moment(scheduled_for).format('h:mm A')}</Typography>
                        </div>
                    </div>

                </CardActionArea>
            </RouterLink>
        </Card>
    );
}

import { Card, CardActionArea, Typography } from '@material-ui/core';
import React from 'react'
import './ClassPreview.css';
import moment from 'moment';

export default function ClassPreview(props) {
    const {
        title,
        author,
        rating,
        scheduledFor,
        onClick
    } = props;

    return (
        <Card>
            <CardActionArea onClick={onClick}>
                <div className="container">
                    <div className="left">
                        <Typography variant="subtitle1" className="ttext" style={{marginTop: 0}}>{title}</Typography>
                        <Typography variant="p" id="author">by {author} ({rating})</Typography>
                    </div>

                    <div style={{flexGrow: 1}}/>

                    <div className="right">
                        <Typography variant="p" id="text" color="textSecondary">Scheduled For:</Typography>
                        <Typography variant="subtitle2" className="date">{scheduledFor.format('MMM Do')}</Typography>
                        <Typography variant="subtitle2" className="date">{scheduledFor.format('h:mm A')}</Typography>
                    </div>
                </div>

            </CardActionArea>
        </Card>
    );
}

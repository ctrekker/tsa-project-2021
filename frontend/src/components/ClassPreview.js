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
                        <Typography variant="p" id="text">Scheduled For:</Typography>
                        <h3 className="date">{scheduledFor.format('MMM Do')}</h3>
                        <h3 className="date">{scheduledFor.format('h:mm A')}</h3>
                    </div>
                </div>

            </CardActionArea>
        </Card>
    );
}

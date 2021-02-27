import { Card, CardActionArea, Typography } from '@material-ui/core';
import React from 'react'
import './ClassPreview.css';
import moment from 'moment';

export default function ClassPreview(props) {
    const {
        name: CLASS_NAME,
        instructor_name: INSTRUCTOR_NAME,
        rating: CLASS_RATING,
        scheduled_for: SCHEDULED_FOR,
        onClick
    } = props;

    return (
        <Card>
            <CardActionArea onClick={onClick}>
                <div className="container">
                    <div className="left">
                        <Typography variant="subtitle1" className="ttext" style={{marginTop: 0}}>{CLASS_NAME}</Typography>
                        <Typography variant="p" id="author">by {INSTRUCTOR_NAME} ({CLASS_RATING})</Typography>
                    </div>

                    <div style={{flexGrow: 1}}/>

                    <div className="right">
                        <Typography variant="p" id="text" color="textSecondary">Scheduled For:</Typography>
                        <Typography variant="subtitle2" className="date">{moment(SCHEDULED_FOR).format('MMM Do')}</Typography>
                        <Typography variant="subtitle2" className="date">{moment(SCHEDULED_FOR).format('h:mm A')}</Typography>
                    </div>
                </div>

            </CardActionArea>
        </Card>
    );
}

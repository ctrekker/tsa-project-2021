import React from 'react'
import './ClassPreview.css';
export default function ClassPreview(props) {
    const {
        title,
        author,
        rating,
        date,
        time
    } = props;

    return (
        <div className="container">

            <div className="left">
                <h2 className="ttext">{title}</h2>
                <p id="author">by {author} ({rating})</p>
            </div>

            <div className="right">
                <p id="text">Scheduled For:</p>
                <h3 className="date">{date}</h3>
                <h3 className="date">{time}</h3>
            </div>
        </div>
    );
}

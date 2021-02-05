import React from 'react'
import './ClassPost.css';
export default function ClassPost(props) {

    const {
        classTitle,
        author,
        rating,
        date,
        time
    } = props
    return (
        <div className ="container">

            <div className = "left">
                <h2 className = "ttext">{classTitle}</h2>
                <p id ="author">by {author} ({rating})</p>
            </div>

            <div className = "right">
                <p id = "text">Scheduled For:</p>
                <h3 className = "date">{date}</h3>
                <h3 className = "date">{time}</h3>
            </div>
        </div>
        
    )
}

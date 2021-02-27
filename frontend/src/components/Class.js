import React from 'react'

export default function ClassComp(props) {
    const {
        name,
        date,
    } = props;

    return (
        <div className = "container">
            <div className = "profile">
                <h2>{name}</h2>
                <h4>{date}</h4>
                <br></br>
                <input type = "text" maxLength = "150"></input>
                <input type = "button" value = "Post" id = "button"></input>
            </div>
        </div>
    )
}
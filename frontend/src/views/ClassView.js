import React from 'react'
import './ClassView.css';

export default function ClassView(props) {
    const {
        name,
        courseName,
        courseDesc,
        date,
    } = props;

    return (
        <div className = "heading">
            <h2>{courseName}</h2>
            <h4>By: {name}</h4>
        </div>
    )
}
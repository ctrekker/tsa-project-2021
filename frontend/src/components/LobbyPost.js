import React from 'react';
import './LobbyPost.css';
import Button from '@material-ui/core/Button';

export default function LobbyPost({ author, content }) {
    return (
        <div>
            <h2 className="author">{ author }</h2>
            <p>{ content }</p>
            <Button onClick={() => alert('test')} variant="contained" color="primary">Test button</Button>
        </div>
    );
}

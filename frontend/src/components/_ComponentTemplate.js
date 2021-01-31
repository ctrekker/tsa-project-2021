import React from 'react';

export default function LobbyPost({ author, content }) {
    return (
        <div>
            <h2>{ author }</h2>
            <p>{ content }</p>
        </div>
    );
}

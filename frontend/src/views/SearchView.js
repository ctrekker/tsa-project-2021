import React, {useEffect, useState} from 'react';
import {Container, Typography, Divider} from '@material-ui/core';
import {useParams} from 'react-router-dom';
import Config from "../Config";
import LobbyPreview from '../components/LobbyPreview';

export default function SearchView() {
    const {q} = useParams();

    const [results, setResults] = useState({});
    
    useEffect(() => {
        fetch(Config.endpoint(`/search/?q=${q}`), {
            method: 'GET'
        }).then(res => res.json())
        .then(res => {
            setResults(res);
        }).catch(err => {
            console.log(err);
        });
    });

    return (
        <Container maxWidth="md" style={{marginTop: 70}}>
            <Typography variant="h4">Search Results</Typography>
            <Typography variant="h5">{ decodeURIComponent(q) }</Typography>
            <Divider/>
            <div>
                {results.lobbies && results.lobbies.length > 0 && (
                    <div>
                        <Typography variant="h6">Lobbies</Typography>
                        {results.lobbies.map(lobby => (
                            <LobbyPreview {...lobby}/>
                        ))}
                    </div>
                )}
                {results.classes && results.classes.length > 0 && (
                    <div>
                        <Typography variant="h6">Classes</Typography>
                    </div>
                )}
                {results.posts && results.posts.length > 0 && (
                    <div>
                        <Typography variant="h6">Posts</Typography>
                    </div>
                )}
                {results.comments && results.comments.length > 0 && (
                    <div>
                        <Typography variant="h6">Comments</Typography>
                    </div>
                )}
                {results.users && results.users.length > 0 && (
                    <div>
                        <Typography variant="h6">Users</Typography>
                    </div>
                )}
            </div>
        </Container>
    );
}

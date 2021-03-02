import React, {useEffect, useState} from 'react';
import {Container, Typography, Divider} from '@material-ui/core';
import {useParams} from 'react-router-dom';

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
                
            </div>
        </Container>
    );
}

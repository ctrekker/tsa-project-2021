import React from "react";
import {Grid} from "@material-ui/core";
import LobbyPreview from "./LobbyPreview";
import Config from '../Config';

export default function LobbyPreviewList({lobbies, scaler = 1}){
    return(
        <Grid container spacing={Math.round(4 * scaler)} style={{padding: 50 * scaler}}>
            {lobbies.map((lobby, i) => ((
                <Grid item sm={12} md={Math.round(6 * scaler)} lg={Math.round(4 * scaler)}>
                    <LobbyPreview {...lobby} picture={`${Config.endpoint(`/lobbies/${lobby.id}/image`)}`}/>
                </Grid>
            )))}
        </Grid>
    );
}
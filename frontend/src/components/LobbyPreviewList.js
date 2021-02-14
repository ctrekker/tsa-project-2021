import react from "react";
import {Grid} from "@material-ui/core";
import LobbyPreview from "./LobbyPreview";

export default function LobbyPreviewList({lobbies}){
    return(
        <Grid container spacing={3} style={{padding: 20}}>
            {lobbies.map((lobby, i) => ((
                <Grid item sm={12} md={6} lg={4}>
                    <LobbyPreview {...lobby}/>
                </Grid>
            )))}
        </Grid>
    );
}

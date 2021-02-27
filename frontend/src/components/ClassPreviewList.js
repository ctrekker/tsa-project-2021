import react from "react";
import {withRouter} from 'react-router-dom';
import {Grid} from "@material-ui/core";
import ClassPreview from "./ClassPreview";

function ClassPreviewList({classPreviews, maxHeight, history}){
    return (
        <div style={{maxHeight: "85vh", overflowY: "auto", marginRight: -50, paddingRight: 50}}>
            <div style={{position: 'sticky', top: 50, padding: '10px'}}>
                <Grid container spacing={2}>
                    {classPreviews.map((classPreview, i) => ((
                        <Grid item xs="12">
                            <ClassPreview {...classPreview} onClick={() => history.push(`/lobby/${classPreview.lobby_id}/class/${classPreview.id}`)}/>
                        </Grid>
                    )))}
                </Grid>
            </div>
        </div>
    );
}

export default withRouter(ClassPreviewList);
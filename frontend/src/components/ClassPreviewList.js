import react from "react";
import {Grid} from "@material-ui/core";
import ClassPreview from "./ClassPreview";

export default function ClassPreviewList({classPreviews, maxHeight}){
    return (
        <div style={{maxHeight: "85vh", overflowY: "auto", marginRight: -50, paddingRight: 50}}>
            <div style={{position: 'sticky', top: 50, padding: '10px'}}>
                <Grid container spacing={2}>
                    {classPreviews.map((classPreview, i) => ((
                        <Grid item xs="12">
                            <ClassPreview {...classPreview}/>
                        </Grid>
                    )))}
                </Grid>
            </div>
        </div>
    );
}
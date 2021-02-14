import react, {useState} from "react";
import {Grid} from "@material-ui/core";
import ClassPreview from "./ClassPreview";

export default function ClassPreviewList({classPreviews}){
    return (
        <div style={{position: 'sticky', top: 50, padding: '10px'}}>
            <Grid container spacing={2}>
                {classPreviews.map((classPreview, i) => ((
                    <Grid item xs="12">
                        <ClassPreview{...classPreview}/>
                    </Grid>
                )))}
            </Grid>
        </div>
    );
}
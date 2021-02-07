import React, {useState} from "react";
import {Card, CardActionArea, CardContent, Typography, SvgIcon, CardActions} from "@material-ui/core/";
import {School, LibraryBooks, Person, Star} from "@material-ui/icons";
import {Link as RouterLink} from 'react-router-dom';
import './LobbyPost.css';


function kFormatter(num) {
    return num == null ? 0 : Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

export default function LobbyPreview({name, category, description, picture, memberCount, postCount, classCount, rating, lobbyId}){
    // TODO figure out when to use this
    const [showCategory, setShowCategory] = useState(true);

    const formattedClassCount = kFormatter(classCount);
    const formattedMemberCount = kFormatter(memberCount);
    const formattedPostCount = kFormatter(postCount);
    const formatteddescription = description == null ?  null : (description).length > 120 ? (description).substring(0, 119) + "..." : description;

    return(
        <Card style = {{height: 200}}>
            {/* TODO proper linking istead of this */}
            <RouterLink className="userLink" to={`/lobby/${lobbyId}`}>
                <CardActionArea>
                    <div style={{display:"flex", flexDirection: "row"}}>
                        {/* TODO add actual default background*/}
                        <img src={picture || 'https://lh3.googleusercontent.com/a-/AOh14GjGp4Umv1QrrFtqqOHUbSbMAulx7XhYJh_Q4esNfA=s96-c'} style = {{borderRadius: 10, height: 50, width:50, backgroundSize: "contatin", backgroundRepeat: "no-repeat", boxShadow: '#00000017 0px 3px 5px 0', border: '2px solid #d5d5d5', margin: 15}}/>
                        <div style={{flexDirection: "column", marginTop: 15}}>
                            {/* TODO determine maximum length and ideal scaling */}
                            <Typography variant={(name).length > 15 ? "subtitle1" : "h6"} style={{fontWeight: "bold"}}>{name}</Typography>
                            {showCategory?<Typography variant="subtitle1" style={{color: "gray", marginTop: -10}}>{category}</Typography>:null}
                        </div>
                    </div>
                    <CardContent style={{height:35, marginTop: -15, marginBottom: 15}}>
                        <Typography variant="p" style ={formatteddescription ? {} : {color: "gray"}}>{formatteddescription ? formatteddescription : "No Description"}</Typography>
                    </CardContent>
                    
                    <CardActions style = {{display: "flex", flexFlow: "row-reverse", padding: 5, margin: 5}}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                        <SvgIcon component={School} style = {{margin: 5}}/>
                            <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto', marginRight: 0}}>{formattedClassCount}</Typography>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <SvgIcon component={LibraryBooks} style = {{margin: 5}}/>
                            <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>{formattedPostCount}</Typography>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                        <SvgIcon component={Person} style = {{margin: 5}}/>
                            <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>{formattedMemberCount}</Typography>
                        </div>
                        {/* TODO add default rating value or placeholder until rating available */}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <SvgIcon component={Star} style = {{margin: 5}}/>
                            <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>{rating}</Typography>
                        </div>
                    </CardActions>
                </CardActionArea>
            </RouterLink>
        </Card>
    );
}


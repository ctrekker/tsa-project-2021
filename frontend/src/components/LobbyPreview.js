import React from "react";
import {Card, CardActionArea, CardContent, Typography, SvgIcon, CardActions} from "@material-ui/core/";
import {School, LibraryBooks, Person, Star} from "@material-ui/icons";
import {Link as RouterLink} from 'react-router-dom';
import './LobbyPost.css';


class LobbyPreview extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {renderedCatergory: true};
    }
    // TODO Figure out when to call this based off of selected category
    renderCategory(){
        this.setState({renderedCategory: true});
    }

    doNotRenderCategory(){
        this.setState({renderedCategory: false});
    }

    // This is almost definiely unneeded but I think it's cool
    kFormatter(num) {
        return num == null ? 0 : Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }

    //TODO make this look better eventually
    render(){
        const renderCategory = this.state.renderedCatergory;
        const formattedClassCount = this.kFormatter(this.props.classCount);
        const formattedMemberCount = this.kFormatter(this.props.memberCount);
        const formattedPostCount = this.kFormatter(this.props.postCount);
        // TODO potentially increase charcter limit
        const formatteddescription = this.props.description == null ? "No Description Available" : (this.props.description).length > 50 ? (this.props.description).substring(0, 49) + "..." : this.props.description
        return(
            <Card style = {{height: 200}}>
                {/* TODO proper linking istead of this */}
                <RouterLink className="userLink" to={`/lobby/${this.props.lobbyId}`}>
                    <CardActionArea>
                        <div style={{display:"flex", flexDirection: "row"}}>
                            {/* TODO add actual default background*/}
                            <img src={this.props.picture || 'https://lh3.googleusercontent.com/a-/AOh14GjGp4Umv1QrrFtqqOHUbSbMAulx7XhYJh_Q4esNfA=s96-c'} style = {{borderRadius: 10, height: 50, width:50, backgroundSize: "contatin", backgroundRepeat: "no-repeat", boxShadow: '#00000017 0px 3px 5px 0', border: '2px solid #d5d5d5', margin: 15}}/>
                            <div style={{flexDirection: "column", marginTop: 15}}>
                                {/* TODO determine maximum length and ideal scaling */}
                                <Typography variant={(this.props.name).length > 15 ? "subtitle1" : "h6"} style={{fontWeight: "bold"}}>{this.props.name}</Typography>
                                {renderCategory?<Typography variant="subtitle1" style={{color: "gray", marginTop: -10}}>{this.props.category}</Typography>:null}
                            </div>
                        </div>
                        <CardContent style={{height:35}}>
                            <Typography variant="p">{formatteddescription}</Typography>
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
                                <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>{this.props.rating}</Typography>
                            </div>
                        </CardActions>
                    </CardActionArea>
                </RouterLink>
            </Card>
        );
    }
}

export default LobbyPreview;
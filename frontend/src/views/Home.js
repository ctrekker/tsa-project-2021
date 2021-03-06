import React, {useState, useEffect} from "react";
import {Divider, Grid, IconButton, Typography, TextField, AppBar, Toolbar} from "@material-ui/core";
import ClassPreviewList from "../components/ClassPreviewList";
import LobbyPreviewList from "../components/LobbyPreviewList";
import moment from "moment";
import {ArrowRight, ArrowLeft} from "@material-ui/icons";
import {Link} from 'react-router-dom';
import Config from "../Config"
import "./Home.css"


// const classPreviews = [
//     { CLASS_NAME:"Basics of Derivatives",  INSTRUCTOR_NAME:"Connor Burns", CLASS_RATING:'4.3/5', SCHEDULED_FOR:moment("2/8/2021 7:30")},
//     { CLASS_NAME:"Mistakes in Calculus 10th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 6:00')},
//     { CLASS_NAME:"Mistakes in Calculus 21th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 8:30')},
//     { CLASS_NAME:"Mistakes in Calculus 21th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 8:30')},
//     { CLASS_NAME:"Mistakes in Calculus 21th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 8:30')},
//     { CLASS_NAME:"Mistakes in Calculus 21th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 8:30')},
//     { CLASS_NAME:"Mistakes in Calculus 21th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 8:30')},
//     { CLASS_NAME:"Mistakes in Calculus 21th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 8:30')},
//     { CLASS_NAME:"Mistakes in Calculus 21th Edition",  INSTRUCTOR_NAME:"Todd Mortley", CLASS_RATING:'6.28/5', SCHEDULED_FOR:moment('2/11/2021 8:30')}
// ];

// const lobbies = [
//     { NAME: 'Algebra', CATEGORY: "Math", DESCRIPTION: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni", picture: "data:image/jpeg;base64,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",
// classCount: 500, memberCount: 341, postCount: 547, rating: 4.3},
//     { NAME: 'Geometry', CATEGORY: "Math", DESCRIPTION: "This is a place to learn geometry", picture: "data:image/jpeg;base64,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",
// classCount: 24, memberCount: 3412, postCount: 1547, rating: 3.8},
//     { NAME: 'Calculus', ID: 1 },
//     { NAME: 'Linear Algebra' },
//     { NAME: 'Complex Analysis' },
//     { NAME: 'Combinatorics' },
//     { NAME: 'Topology' },
//     { NAME: 'Biology' },
//     { NAME: 'Chemistry' },
//     { NAME: 'Physics' },
//     { NAME: 'Environmental Science' },
//     { NAME: 'United States History' },
//     { NAME: 'World History' },
//     { NAME: 'European History' },
//     { NAME: 'Spanish', category: "Foreign Language"}
// ]

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


export default function Home(){
    const [lobbies, setLobbies] = useState([]);

    useEffect(() => {
        fetch(Config.endpoint('/lobbies/?userLobbies=true'), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setLobbies(res);
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [setLobbies]);

    const [classPreviews, setClassPreviews] = useState([]);

    useEffect(() => {
        fetch(Config.endpoint('/classes'), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            console.log(res)
            setClassPreviews(res);
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [setClassPreviews]);
    // TODO make searchbar work and look better
    const [scaler, setScaler] = useState(1/.66);
    const [lobbyPreviewListStyle, setLobbyPreviewListStyle] = useState(false);
    const [showClasses, setShowClasses] = useState(true);
    const [showButton, setShowButton] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const maxHeight  = "85vh";
    const buttonStyle = {position: "fixed", right: "-4", top: "40vh", fontSize: "6em", backgroundColor: "none", zIndex: 1}
    let closedAt = 0;
    let openedAt = 0;

    function expand(opened){
        setShowClasses(true);
        setShowButton(false)
        setScaler(1/.66);
        setLobbyPreviewListStyle(true)
        sleep(300).then(()=>{
            setLobbyPreviewListStyle(false)
        });
        openedAt = opened
    }
    
    function contract(closed){
        setShowClasses(false);
        setScaler(1);
        setLobbyPreviewListStyle(false)
        setShowButton(true)
        closedAt = closed
    }

    useEffect(() => {
        function handleScroll(e) {
            if(window.scrollY - openedAt > 250 && showClasses) {
                contract(window.scrollY);
            }
            else if((window.scrollY == 0 || (closedAt > 50 && window.scrollY < 50)) && !showClasses) {
                expand(window.scrollY);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [showClasses, setShowClasses]);

    const selectedLobbies = lobbies.filter(s => s.name.substring(0, searchQuery.length).toLowerCase() === searchQuery)
    const selectedLobbyIds = selectedLobbies.map(x => x.id);
    const selectedClasses = classPreviews.filter(s => selectedLobbyIds.includes(s.lobby_id));
    for(let selectedClass of selectedClasses) {
        selectedClass.scheduledFor = moment(selectedClass.scheduled_for);
    }

    return (
        <div>
            <div id = "scale" className = {showClasses ? "small" : "big"} style = {lobbyPreviewListStyle ? {overflowX: "hidden", overflowY: "hidden", maxWidth: 96 / scaler + "vw"} : {maxWidth: 96 / scaler + "vw"}}>
                <TextField label="Search joined lobbies" onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} style={{minWidth: "40%", marginLeft: "30%", textAlign: "center", marginTop: "8%"}}/>
                <LobbyPreviewList lobbies={selectedLobbies} scaler={scaler}/>
                {selectedLobbies.length === 0 && (
                    <i style={{marginLeft: 45}}>That query returned no results. <Link to={`/search/${encodeURIComponent(searchQuery)}`}>Search all lobbies instead</Link></i>
                )}
            </div>
                <Grid id = "sidebar" className = {showClasses ? 'slideIn' : 'slideOut'} container xs="4" style={{borderLeft: '1px solid lightgrey', position: "fixed", top: "10%", right: 0, minHeight: "100%", zIndex:2}}>
                    <div style={{display:"flex", flexDirection:"column", padding: 15, position: "sticky", overflowX: "hidden"}}>
                        <div style={{display:"flex", flexDirection:"row"}}>
                            <IconButton component={ArrowRight} onClick={() => {contract()}} style={{fontSize:"2em", right:-5}}/>
                            <Typography variant="h4" style={{marginTop:7}}>Upcoming Classes</Typography>
                        </div>
                        <Divider/>
                        <ClassPreviewList classPreviews={selectedClasses} maxHeight = {maxHeight}/>
                    </div>
                </Grid>
            <IconButton id = "sidebar" className = {showButton ? "slideIn" : "slideOut"} component = {ArrowLeft} onClick={() => expand()} style={showButton ? buttonStyle : buttonStyle}/>
        </div>
    );
}

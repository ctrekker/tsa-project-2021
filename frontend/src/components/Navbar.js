import React, {useState, useEffect} from "react";
import {AppBar, Button, Toolbar, Typography, InputBase, SvgIcon} from "@material-ui/core";
import {withRouter} from 'react-router-dom';
import {Search, AccountCircle}from '@material-ui/icons';
import Config from "../Config"
import FlexCenter from "./FlexCenter";
import logo from '../icon.png';

function Navbar({history}) {
const [name, setName] = useState()

useEffect(() => {
    fetch(Config.endpoint('/users'), {
        method: 'GET',
        credentials: 'include'
    }).then(res => res.json())
    .then(res => {
        setName(res.name);
    }).catch(err => {
        if(err) console.log(err);
    });
}, [setName]);
  
return (
    <div style = {{position: 'sticky', zIndex: 6}}>
      <AppBar>
        <Toolbar>
          <FlexCenter>
            <img src={logo} style={{width: 20, height: 20, marginRight: 10}} draggable="false"/>
            <Typography variant="h6" noWrap>eLearn</Typography>
          </FlexCenter>
          <div>
            <Button onClick={() => history.push("/home")} variant="contained" color='primary' size='large' style = {{top: 0, minHeight: 62, position: "fixed", left: "14%", boxShadow: "none"}}>Home</Button>
          </div>
          <div>
            <Button onClick={() => history.push("/lobbies")} variant="contained" color='primary' size='large' style = {{top: 0, minHeight: 62, position: "fixed", left: "20%", boxShadow: "none"}}>Lobbies</Button>
        </div>
          <div style = {{position: "fixed", right: "15%", display: "flex", flexDirection: "row"}}>
            <div>
              <SvgIcon component = {Search} style = {{marginTop: 15, color: "white"}}/>
            </div>
            <InputBase
              placeholder=" Search…"
              inputProps={{ 'aria-label': 'search' }}
              style = {{color: "black", minWidth: "50vw", backgroundColor: "white", margin: 10}}
            />
          </div>
          <div style = {{position: 'fixed', right: "3%", display: "flex", flexDirection: "row"}}>
            <Typography variant="body2" noWrap style = {{marginTop: 2}}>
                {name}
            </Typography>
            <SvgIcon component = {AccountCircle} style = {{color: "white", marginLeft: 10}}/>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Navbar);
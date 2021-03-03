import React, {useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Card, CardContent, CardActions, SvgIcon, Grid, Typography} from "@material-ui/core";
import {School, LibraryBooks, Person} from "@material-ui/icons";
import './Landing.css';
import Config from '../Config';

function Landing({ history }) {
  const [showLobbies, setShowLobbies] = useState(false)

  useEffect(() => {
    function handleScroll(e) {
        if(window.scrollY > window.innerHeight/2 -100) {
            setShowLobbies(true)
        }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    }
}, [showLobbies, setShowLobbies]);

const [showClasses, setShowClasses] = useState(false)

  useEffect(() => {
    function handleScroll(e) {
        if(window.scrollY > window.innerHeight * 1.1) {
            setShowClasses(true)
        }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    }
}, [showClasses, setShowClasses]);
  
  useEffect(() => {
    setTimeout(() => {
      /*global gapi*/
      /*eslint no-undef: "error"*/
      const GoogleAuth = gapi.auth2.getAuthInstance();
      const user = GoogleAuth.currentUser.get();
      const profile = user.getBasicProfile();
      if(profile) {
        history.push('/home');
      }
    }, 3000);
  });
  window.onSignIn = (googleUser) => {
    console.log('sign in');
    const token = googleUser.getAuthResponse().id_token;
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId());
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail());
    fetch(Config.endpoint('/users'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ token })
    }).then(() => {
      history.push('/home');
    });
  };

  function handleSignIn(){
    history.push('/home');
  }

  return (
    <div style = {{overflowX: "hidden"}}>
      <div className = "content">
        <div style = {{minHeight: "67vh", backgroundColor: "lightblue", paddingTop: "30vh"}}>
          <Typography variant = {"h1"} style = {{fontFamily: "Fantasy"}}>eLearn</Typography>
          <Typography variant = {"h6"} style = {{color: "GrayText"}}>A place where everyone is a student and a teacher</Typography>
          <Button onClick = {handleSignIn} variant="contained" size = "large" color = "primary" style ={{marginTop: "10%", minWidth: "30%", minHeight: "20%", fontSize: "2em"}}>Join Now!</Button>
        </div>
      </div>
      <div className = "content">
        <div style = {{minHeight: "65vh", paddingTop: "10vh", display: 'flex', flexDirection: "column", overflowX: "hidden"}}>
          <Typography variant = {"h3"} style = {{fontFamily: "fantasy"}}>Join Lobbies about Subjects You're Intrested in</Typography>
          <div id = "sliding" className = {showLobbies ? 'slideIn' : 'slideOut'}>
            <Grid container spacing = {8} style = {{marginTop: 50, maxWidth: "90vw", marginLeft: "5vw"}}>
              <Grid item lg = {4}>
              <Card style = {{height: 200}}>
                  <div style={{display:"flex", flexDirection: "row"}}>
                      <img src={"https://live.staticflickr.com/2739/4257452000_3cc3586d5a_b.jpg"} style = {{borderRadius: 10, height: 50, width:50, backgroundSize: "contatin", backgroundRepeat: "no-repeat", boxShadow: '#00000017 0px 3px 5px 0', border: '2px solid #d5d5d5', margin: 15}}/>
                      <div style={{flexDirection: "column", marginTop: 15}}>
                          <Typography variant={"h6"} style={{fontWeight: "bold"}}>Calculus</Typography>
                          <Typography variant="subtitle1" style={{color: "gray", marginTop: -10}}>Math</Typography>
                      </div>
                  </div>
                  <CardContent style={{height:35, marginTop: -15, marginBottom: 15}}>
                      <Typography variant="p" color={'textPrimary'}>A place to learn calculus</Typography>
                  </CardContent>
                  
                  <CardActions style = {{display: "flex", flexFlow: "row-reverse", padding: 5, margin: 5}}>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                      <SvgIcon component={School} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto', marginRight: 0}}>78</Typography>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                          <SvgIcon component={LibraryBooks} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>2.8k</Typography>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                      <SvgIcon component={Person} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>178</Typography>
                      </div>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item lg = {4}>
              <Card style = {{height: 200}}>
                  <div style={{display:"flex", flexDirection: "row"}}>
                      <img src={"https://torange.biz/photo/42/HD/book-books-english-textbooks-42291.jpg"} style = {{borderRadius: 10, height: 50, width:50, backgroundSize: "contatin", backgroundRepeat: "no-repeat", boxShadow: '#00000017 0px 3px 5px 0', border: '2px solid #d5d5d5', margin: 15}}/>
                      <div style={{flexDirection: "column", marginTop: 15}}>
                          <Typography variant={"h6"} style={{fontWeight: "bold"}}>AP Lit</Typography>
                          <Typography variant="subtitle1" style={{color: "gray", marginTop: -10}}>English</Typography>
                      </div>
                  </div>
                  <CardContent style={{height:35, marginTop: -15, marginBottom: 15}}>
                      <Typography variant="p" color={'textPrimary'}>A place to AP Literature and Composition</Typography>
                  </CardContent>
                  
                  <CardActions style = {{display: "flex", flexFlow: "row-reverse", padding: 5, margin: 5}}>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                      <SvgIcon component={School} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto', marginRight: 0}}>28</Typography>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                          <SvgIcon component={LibraryBooks} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>1.2k</Typography>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                      <SvgIcon component={Person} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>94</Typography>
                      </div>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item lg = {4}>
              <Card style = {{height: 200}}>
                  <div style={{display:"flex", flexDirection: "row"}}>
                      <img src={"https://static.thenounproject.com/png/828977-200.png"} style = {{borderRadius: 10, height: 50, width:50, backgroundSize: "contatin", backgroundRepeat: "no-repeat", boxShadow: '#00000017 0px 3px 5px 0', border: '2px solid #d5d5d5', margin: 15}}/>
                      <div style={{flexDirection: "column", marginTop: 15}}>
                          <Typography variant={"h6"} style={{fontWeight: "bold"}}>World History</Typography>
                          <Typography variant="subtitle1" style={{color: "gray", marginTop: -10}}>Social Studies</Typography>
                      </div>
                  </div>
                  <CardContent style={{height:35, marginTop: -15, marginBottom: 15}}>
                      <Typography variant="p" color={'textPrimary'}>A place to learn the history of the world</Typography>
                  </CardContent>
                  
                  <CardActions style = {{display: "flex", flexFlow: "row-reverse", padding: 5, margin: 5}}>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                      <SvgIcon component={School} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto', marginRight: 0}}>204</Typography>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                          <SvgIcon component={LibraryBooks} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>5.8k</Typography>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                      <SvgIcon component={Person} style = {{margin: 5}}/>
                          <Typography variant="p" component="span" style={{marginTop: 'auto', marginBottom: 'auto'}}>778</Typography>
                      </div>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <div className = "content">
        <div style = {{minHeight: "40vh", backgroundColor: "lightblue", paddingTop: "10vh"}}>
          <Typography variant = {"h3"} style = {{fontFamily: "Fantasy"}}>Join classes to learn or teach them</Typography>
          <div id = "sliding" className = {showClasses ? 'slideIn' : 'slideOut'} style = {{display: "flex", flexDirection: "row", marginTop: 50, marginBottom: 50}}>
          <Card style = {{marginLeft: "15%", marginRight: "10%", minWidth: "30vw"}}>
                <div className="container">
                    <div className="left">
                        <Typography variant="subtitle1" className="ttext" style={{marginTop: 0}}>Physics</Typography>
                        <Typography variant="p" id="author">by Isaac Newton (2.4/5)</Typography>
                    </div>

                    <div style={{flexGrow: 1}}/>

                    <div className="right">
                        <Typography variant="p" id="text" color="textSecondary">Scheduled For:</Typography>
                        <Typography variant="subtitle2" className="date">March 14</Typography>
                        <Typography variant="subtitle2" className="date">4:30 PM</Typography>
                    </div>
                </div>
        </Card>
          <Card style = {{minWidth: "30vw"}}>
                <div className="container">
                    <div className="left">
                        <Typography variant="subtitle1" className="ttext" style={{marginTop: 0}}>Intro to Integrals</Typography>
                        <Typography variant="p" id="author">by Professor Professorson (4.3/5)</Typography>
                    </div>

                    <div style={{flexGrow: 1}}/>

                    <div className="right">
                        <Typography variant="p" id="text" color="textSecondary">Scheduled For:</Typography>
                        <Typography variant="subtitle2" className="date">June 28</Typography>
                        <Typography variant="subtitle2" className="date">7:30 PM</Typography>
                    </div>
                </div>
        </Card>
          </div>
        </div>
      </div>
      <div className = "content">
        <div style = {{minHeight: "65vh", paddingTop: "30vh", textAlign: 'center'}}>
          <Typography variant = {"h1"} style = {{fontFamily: "Fantasy"}}>eLearn</Typography>
          <Button onClick = {handleSignIn} variant="contained" size = "large" color = "primary" style ={{marginTop: "10%", minWidth: "30%", minHeight: "20%", fontSize: "2em"}}>Join Now!</Button>
          <div className="g-signin2" data-onsuccess="onSignIn"></div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Landing);

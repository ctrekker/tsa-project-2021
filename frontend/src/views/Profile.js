import React, {useState, useEffect} from "react";
import { Container, Divider, Typography, Grid } from "@material-ui/core";
import Config from "../Config"
import { useParams } from "react-router-dom";
import LobbyPost from "../components/LobbyPost";
import Moment from "moment"

export default function Profile(props) {

    const userId = useParams().userId;

    const [userData, setUserData] = useState();
    const [picture, setPicture] = useState("'https://lh3.googleusercontent.com/a-/AOh14GjGp4Umv1QrrFtqqOHUbSbMAulx7XhYJh_Q4esNfA=s96-c'");
    const [name, setName] = useState("Steve");

    useEffect(() => {
        fetch(Config.endpoint('/users/' + userId), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setUserData(res)
            setPicture(res.picture)
            setName(res.name)
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [setUserData]);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(Config.endpoint('/users/' + userId + '/posts'), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setPosts(res)
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [setPosts]);

    return (
        <div>
            <Container>
                <div style = {{display: "flex", flexDirection: "column", marginLeft: "20%", marginRight: "20%", marginTop: 70, marginBottom: 10, alignItems: "center", justifyContent: "center"}}>
                    <img src = {picture} style = {{borderRadius: 10, height: 150, width:150, backgroundSize: "contatin", backgroundRepeat: "no-repeat", boxShadow: '#00000017 0px 3px 5px 0', border: '2px solid #d5d5d5', margin: 15}}/>
                    <Typography varient = "h4" style = {{fontWeight: "bolder", fontSize: "2em"}}>{name}</Typography>
                </div>
                <Divider/>
                <div>
                    <Typography varient = "h6" style = {{textAlign: "center", fontWeight: "bold", fontSize: "2.5em", marginBlock: 10}}>Recent Posts</Typography>
                    <Grid container spacing = {4}>
                    {posts.map((post, i) => ((
                        <Grid item xs="6">
                            <LobbyPost {...post} author = {userData} createdAt = {Moment(post.created_at)}/>
                        </Grid>
                    )))}
                    </Grid>
                </div>
            </Container>
        </div>
    )
}
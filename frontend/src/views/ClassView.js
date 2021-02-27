import React, {useState, useEffect} from "react";
import './ClassView.css';
import Config from "../Config"
import Class from "../components/Class";

export default function ClassView(props) {
    
    const [name, setName] = useState();
    const [courseName, setCourseName] = useState();
    const [memberOf, setMemeberOf] = useState(false)
    const [currentClass, setCurrentClass] = useState();

    const lobbyId = window.location.pathname.split("/")[2];
    const classId = window.location.pathname.split("/")[4];

    useEffect(() => {
        fetch(Config.endpoint('/lobbies/' + lobbyId + '/classes/' + classId + '/'), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            setCurrentClass(res.class)
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [setCurrentClass]);

    console.log(currentClass.instructor_name)
    setName(currentClass.INSTRUCTOR_NAME);
    setCourseName(currentClass.NAME);

    useEffect(() => {
        fetch(Config.endpoint('/classes/'), {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
        .then(res => {
            console.log(res)
        }).catch(err => {
            if(err) console.log(err);
        });
    }, [setMemeberOf]);

    return (
        <div className = "heading">
            <h2>{courseName}</h2>
            <h4>By: {name}</h4>
            <Class name = "Hi" date = "12/4/21"/>
        </div>
    )
}
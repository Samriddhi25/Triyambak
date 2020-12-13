import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase'
import { auth, firestore as db } from './firebase/firebase'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './pages/loginpage/loginpage'
import UserData from './pages/homepage/homepage.js'
import NavBar from "./component/navbar/navbar.js"
import SideBar from "./component/sidebar/sidebar.js";
import OfficerScreen from './pages/officerscreen/officerscreen.js';
import ProfileScreen from './pages/profilescreen/profilescreen.js';
import VolunteerScreen from './pages/volunteerscreen/volunteerscreen.js';
import VolunteerLogs from './pages/volunteerlogs/volunteerlogs.js';
import OfficerLogs from './pages/officerlogs/officerlogs.js';
import CaseTeam from './pages/officerlogs/caseteam.js';
import VolunteerModal from './pages/volunteerscreen/volunteermodal.js'
import OfficerModal from './pages/officerscreen/officermodal.js'
import CaseModal from './pages/homepage/casemodal.js'
import EditCase from './pages/volunteerlogs/editcases.js'
import Image from './pages/volunteerlogs/image.js'
import Documents from './pages/homepage/documents.js'
import FileLogs from './pages/filescreen/filelogs.js'
import AddMember from './pages/addmember/addmember.js'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      role: null,
      id: null,
    }
  }

  ip = require('ip');

  componentDidMount() {
    this.authListener()
  }

  authListener() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
        const email = user.email;
        this.setState({id : email.substring(0, 7)})
        this.verifyListener(email.substring(0, 7))
        //console.log(user.uid);
      } else {
        this.setState({ user: null })
      }
    })
  }

  verifyListener(key) {
    //console.log(userId);
    db
    .collection('users')
    .doc(key)
    .get()
    .then(doc => {
        var roles = doc.data();
        if (roles.role) {
          this.setState({ role: roles.role })
          this.log()
        } else {
          this.setState({ role: null })
        }
    });

  }

  log(){

    db.collection('LOGS').add({
      eventId : "",
      ip: this.ip.address(),
      lm: "",
      message: this.state.id + " got loged in",
      timestamping: firebase.firestore.FieldValue.serverTimestamp(),
      userId : this.state.id
    }).then(function(docRef) {
      console.log("id ==>", docRef.id);
      db.collection('LOGS').doc(docRef.id).update({
        eventId: docRef.id
    });
    }).catch(function(error){
      console.error("id ==>", error);
    })


  }

  render() {
    if (this.state.user && this.state.role === "officer") {
      return (
        <Router>
          <NavBar/>
              <Switch>
              <Route exact path='/' component={OfficerLogs}></Route>
              <Route exact path='/cases/:caseId' component={CaseTeam}></Route>
              <Route exact path='/profile' component={ProfileScreen}></Route>
              </Switch>
              <SideBar team={this.state.role}/>
        </Router>
      );
    } else if (this.state.user && this.state.role === "volunteer") {
      return (
        <Router>
          <NavBar/>
              <Switch>
              <Route exact path='/' component={VolunteerLogs}></Route>
              <Route exact path='/edit/:caseId' component={EditCase}></Route>
              <Route exact path='/change/:imageId' component={Image}></Route>
              <Route exact path='/profile' component={ProfileScreen}></Route>
              </Switch>
              <SideBar team={this.state.role}/>
        </Router>
      );
    } else  if (this.state.user && this.state.role === "admin") {
      return (
        <Router>
          <NavBar/>
              <Switch>
              <Route exact path='/' component={UserData}></Route>
              <Route exact path='/cases/:caseId' component={CaseModal}></Route>
              <Route exact path='/docs/:caseId' component={Documents}></Route>
              <Route exact path='/change/:imageId' component={Image}></Route>
              <Route exact path='/officer' component={OfficerScreen}></Route>
              <Route exact path='/officer/:userId' component={OfficerModal}></Route>
              <Route exact path='/volunteer' component={VolunteerScreen}></Route>
              <Route exact path='/volunteer/:userId' component={VolunteerModal}></Route>
              <Route exact path='/member' component={AddMember}></Route>
              <Route exact path='/profile' component={ProfileScreen}></Route>
              <Route exact path='/logs' component={FileLogs}></Route>
              </Switch>
              <SideBar team={this.state.role}/>
        </Router>
      );
    } else {
      return (
        <Router>
          <Route path='/'><Login/></Route>
        </Router>
      );
    }
  }
}
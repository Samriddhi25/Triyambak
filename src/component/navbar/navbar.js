import React from 'react';
import firebase from 'firebase'
import { NavLink, Link } from 'react-router-dom';
import { auth , firestore as db} from '../../firebase/firebase';
import './navbar.css';
import logo from '../../wow.png'
export default function NavBar(props) {

  var ip = require('ip');
  const user = auth.currentUser;
  const check = user.email;

  function log() {

    db.collection('LOGS').add({
      eventId: "",
      ip: ip.address(),
      lm: "",
      message: check.substring(0, 7) + " is logged out",
      timestamping: firebase.firestore.FieldValue.serverTimestamp(),
      userId: check.substring(0, 7)
    }).then(function (docRef) {
      console.log("id ==>", docRef.id);
      db.collection('LOGS').doc(docRef.id).update({
        eventId: docRef.id
      });
    }).catch(function (error) {
      console.error("id ==>", error);
    })


  }
  return (
    <div className='navbar'>
      <NavLink className='logo finger-on-me active' to='/'>
        <img src={logo} style={{width: '60px', marginLeft: '20px', marginTop: '7px'}} alt="decoders" className="mylogo" />
      </NavLink>

      <div className='links'>
        {

          <button
            className='signout-btn finger-on-me'
            onClick={() => {
              auth.signOut(),
                log()
            }}
          >
            <Link to='/'><h3 className='unsign'>LOGOUT</h3></Link>
          </button>

        }
      </div>
    </div>
  )
}

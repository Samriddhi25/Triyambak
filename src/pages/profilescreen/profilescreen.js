import React, { useState, useEffect } from 'react'
import { auth, firestore as db } from "../../firebase/firebase";
import { Link } from 'react-router-dom'
import './profilescreen.css'

export default function ProfileScreen(props) {

  const user = auth.currentUser;
  const check = user.email;
  const [me, updateMe] = useState([])

  useEffect(() => {
    db
      .collection('users')
      .doc(check.substring(0, 7))
      .get()
      .then(doc => {
        updateMe(() => doc.data())
      }
      );
  }, [])

  console.log(me);

  return (
    <div className='info'>
      <h2>My Details</h2>
      <br /><br />
      { console.log(me)}
      <table className="profile">
        <tr>
          <td>FULL NAME</td>
          <td>{me.name}</td>
        </tr>
        <tr>
          <td>OFFICIAL ID</td>
          <td>{me.userId}</td>
        </tr>
        <tr>
          <td>EMAIL</td>
          <td>{me.email}</td>
        </tr>
        <tr>
          <td>CONTACT No.</td>
          <td>{me.contact}</td>
        </tr>
        <tr>
          <td>CURRENT ROLE</td>
          <td>{me.role}</td>
        </tr>
        <tr>
          <td>SERVICE STATION</td>
          <td>{me.station}</td>
        </tr>
      </table>
    </div>
  )
}

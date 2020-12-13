import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import 'react-responsive-modal/styles.css'
import firebase from "firebase";
import { auth, firestore as db } from '../../firebase/firebase';
import { Modal } from 'react-responsive-modal'
import './addmember.css'

export default function AddMember(props) {

  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [station, setStation] = useState();
  const [contact, setContact] = useState();

  const handleSubmit = () => {

    const use = email.substring(0, 7)

    db.collection('users')
      .doc(use)
      .set({
        cases: [],
        contact: contact,
        email: email,
        name: name,
        role: role,
        station: station,
        userId: use,
      })
      .then(
        window.alert(" Member Added Successfully ")
      )

  }

  return (
    <div className='login-form-wrapper'>
      <h2>Add Details for new Officers or volunteers</h2><br />
      <div className='login-divider'>
        <Form>
          <table className='form'>
            <tr className='row'>
              <td className='label'>
                <Form.Label>Email address</Form.Label>
              </td>
              <td>
                <input type="email" placeholder="Enter email" className='input' onChange={e => setEmail(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className='label'>
                <Form.Label >Full Name</Form.Label>
              </td>
              <td>
                <input className='input' type="text" placeholder="Enter name" onChange={e => setName(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className='label'>
                <Form.Label >Service Station</Form.Label>
              </td>
              <td>
                <input className='input' type="text" placeholder="Service Station" onChange={e => setStation(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className='label'>
                <Form.Label >Contact</Form.Label>
              </td>
              <td>
                <input className='input' type="text" placeholder="contact" onChange={e => setContact(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className='label'>
                <Form.Label >Role</Form.Label>
              </td>
              <td>
                <Form.Control className='input' as="select" size="lg" onChange={e => setRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="officer">Investigation Officer</option>
                </Form.Control>
              </td>
            </tr>
          </table>
          <Button variant="primary" onClick={handleSubmit} className='button'>
            Next
          </Button>
        </Form>
      </div>

    </div>
  )
}

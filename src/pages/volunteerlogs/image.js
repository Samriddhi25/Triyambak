import React, { useState, useEffect } from 'react'
import { Input, Button } from 'rsuite';
import firebase from 'firebase'
import { useParams } from "react-router-dom";
import { auth, firestore as db } from '../../firebase/firebase';
import './volunteerlogs.css'

export default function Image(props) {

  const { imageId } = useParams()
  const [prevText,setprevText] = useState()
  const [image, updateImage] = useState(null)
  const [trasnlated, setTrasnlated] = useState()
  const [check, setCheck] = useState(true)

  useEffect(() => {
    db.collection('IMAGES')
      .doc(imageId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return alert('No Image with this ID')
        } else {
          setTrasnlated(doc.data().text)
          setprevText(doc.data().text)
          updateImage(() => doc.data())
        }
      })

  }, [imageId])

  function handleSubmit() {
    console.log("submit")
    console.log(trasnlated)

    db.collection('IMAGES').doc(imageId).update({
      text: trasnlated
    }).then(window.alert("Changes Updated successfully"), log());
  }

  var ip = require('ip');
  const user = auth.currentUser;
  const checks = user.email;

  function log() {

    db.collection('LOGS').add({
      eventId: "",
      ip: ip.address(),
      lm: "",
      message: checks.substring(0, 7) + " updated the text from ==> " + prevText + " to ==>" + trasnlated + " for ImageId " + imageId ,
      timestamping: firebase.firestore.FieldValue.serverTimestamp(),
      userId: checks.substring(0, 7)
    }).then(function (docRef) {
      console.log("id ==>", docRef.id);
      db.collection('LOGS').doc(docRef.id).update({
        eventId: docRef.id
      });
    }).catch(function (error) {
      console.error("id ==>", error);
    })


  }

  if (!image) return <div>Loading...</div>


  return (
    <div className="volunteer">
      <div className='main'>
        <div className='mypage'>
          <img src={image.url} alt="case img"
            style={{
              display: 'inline-block',
              width: '60vw',
              height: '75vh',
              margin: '10px auto'
            }} />
          <hr />
          <br />
          <table>
            <tr>
              <td><Button color="yellow" onClick={() => setCheck(false)}>Edit</Button></td>
              <td><Button color="yellow" onClick={() => { handleSubmit(); setCheck(true) }}>Submit</Button></td>
            </tr>
          </table>

          <br />
          <Input
            componentClass="textarea"
            rows={3}
            style={{ width: '75vw', height: '45vh', resize: 'auto', color: 'black' }}
            placeholder="Tranlated text goes here"
            value={trasnlated}
            disabled={check}
            onChange={(value) => setTrasnlated(value)}
          />

        </div>
      </div>
    </div>
  )
}

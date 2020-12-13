import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from "react-router-dom";
import firebase from "firebase";
import {auth, firestore as db } from '../../firebase/firebase';
import CaseData from '../../component/casedata/casedata.js';
import 'rsuite/dist/styles/rsuite-default.css';
import {Modal, Table, Button } from 'rsuite';
import './officerlogs.css'

const { Column, HeaderCell, Cell, Pagination } = Table;

export default function CaseTeam(props) {

  const { caseId } = useParams()
  var ip = require('ip');
  const user = auth.currentUser;
  const check = user.email;
  const [newOfficer, updateNewOfficer] = useState([])
  const [open1, setOpen1] = useState(false)
  const [cases, updateCase] = useState([])
  const [users, updateUsers] = useState([])
  const [updateofficer, updateofficerList] = useState([])

  const [displayLength, setDisplayLength] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()

  useEffect(() => {

    db.collection('cases')
      .doc(caseId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return alert('No case with this ID')
        } else {
          updateCase(() => doc.data())
          const UserData = doc.data().userId
          // reset users state every time this component is updated
          updateUsers(() => [])
          db
            .collection('users')
            .doc(UserData)
            .get()
            .then(doc =>
              updateUsers(prevState => [
                ...prevState,
                { ...doc.data(), userId: doc.id }
              ])
            )

        }
        const OfficerData = doc.data().users
        const size = doc.data().users.length

        //// console.log(users);
        myUser(OfficerData, size)
      })
  }, [caseId])


  function myUser(OfficerData, size) {

    if (size >= 1) {
      if (OfficerData.length !== 0) {
        updateofficerList(() => [])
        OfficerData.forEach(userId => {

          db
            .collection('users')
            .doc(userId)
            .get()
            .then(doc =>
              updateofficerList(prevState => [
                ...prevState,
                { ...doc.data(), userId: doc.id },
              ])
            )
        })
      }
      //  // console.log(users)
    }
  }

  function addteam() {
    db.collection('users')
      .get()
      .then(snapshot =>
        updateNewOfficer(
          snapshot.docs
            .filter(doc => doc.data().role === 'officer')
            .map(doc => ({ ...doc.data(), userId: doc.id }))
        )
      )
    setOpen1(true)
  }

  function accept(userId) {

    db.collection('cases')
      .doc(caseId)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(userId)
      }).then(
        console.log(users),
        window.alert("Field updated"),
         log(check.substring(0, 7) + " added "+ userId +" to the caseID " + caseId)
      )

    db
      .collection('users')
      .doc(userId)
      .update({
        cases: firebase.firestore.FieldValue.arrayUnion(caseId)
      })

  }
  
  function log(text) {
  
    db.collection('LOGS').add({
      eventId: "",
      ip: ip.address(),
      lm: "",
      message: text,
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

  
  function getNewOfficer() {

    const officerdata = newOfficer.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })

    if (sortColumn && sortType) {
      return officerdata.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (typeof x === 'string') {
          x = x.charCodeAt()
        }
        if (typeof y === 'string') {
          y = y.charCodeAt()
        }
        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })
    }
    return officerdata
  }


  function getupdateofficer() {
    //  // console.log(updateofficer)
    const volunteerdata = updateofficer.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })

    if (sortColumn && sortType) {
      return volunteerdata.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (typeof x === 'string') {
          x = x.charCodeAt()
        }
        if (typeof y === 'string') {
          y = y.charCodeAt()
        }
        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })
    }
    return volunteerdata
  }

  function handleSortColumn(sortColumn, sortType) {
    setLoading(true)

    setTimeout(() => {
      setSortColumn(sortColumn)
      setSortType(sortType)
      setLoading(false)
    }, 500)
  }

  function handleChangePage(dataKey) {
    setPage(dataKey)
  }

  function handleChangeLength(dataKey) {
    setPage(1)
    setDisplayLength(dataKey)
  }

  if (!cases) return <div>Loading...</div>

  return (
    <div className='cases'>
      <div class='main'>
        <div className='mypage'>
          {(!cases) ? <div>Loading...</div> :
            <div>
              <h2 className='title'>Details</h2>
              <div className='containe'>

                <CaseData key={cases.caseId}  {...cases} />
              </div>
            </div>
          }
          </div>
           <div>
             <Button className="edit" onClick={() => addteam()} color="yellow">Add Associate</Button>
           <br />
          <br />
          <hr />
          <br />

          <div>
          </div>
          <div >
            <Modal show={open1} size="sm" overflow>
              <h3 style={{ textAlign: "center" }}>Associate List</h3>
              <Table
                autoHeight
                rowHeight={60}
                data={getNewOfficer()}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                loading={loading}
              >
                <Column width={160} align="justify" sortable>
                  <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Full Name</HeaderCell>
                  <Cell dataKey="name" />
                </Column>

                <Column width={160} align="center">
                  <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Official Id</HeaderCell>
                  <Cell dataKey="userId"></Cell>
                </Column>

                <Column width={120} fixed="right">
                  <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Action</HeaderCell>
                  <Cell>
                    {rowData => {
                      return (
                        <span>
                          <Button onClick={() => accept(rowData.userId)} color="yellow">Add</Button>
                        </span>
                      );
                    }}
                  </Cell>
                </Column>
              </Table>
              <Button onClick={() => { setOpen1(false) }}>Close</Button>
            </Modal>
          </div>
          {
            updateofficer.length === 0 ? "No officer assigned yet" :
              <div>
                <h3 className='title'>Investigator Officers of the Case</h3>
                <div className='subcases'>
                  <Table
                    autoHeight
                    rowHeight={60}
                    data={getupdateofficer()}
                    sortColumn={sortColumn}
                    sortType={sortType}
                    onSortColumn={handleSortColumn}
                    loading={loading}
                  >
                    <Column width={180} align="justify" sortable>
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Full Name</HeaderCell>
                      <Cell dataKey="name" />
                    </Column>

                    <Column width={150} align="justify" sortable>
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Role</HeaderCell>
                      <Cell dataKey="role" />
                    </Column>

                    <Column width={250} align="justify" sortable>
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Email</HeaderCell>
                      <Cell dataKey="email" />
                    </Column>

                    <Column width={250} align="center">
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Official Id</HeaderCell>
                      <Cell dataKey="userId"></Cell>
                    </Column>
                  </Table>

                  <Pagination
                    lengthMenu={[
                      {
                        value: 10,
                        label: 10
                      },
                      {
                        value: 20,
                        label: 20
                      }
                    ]}
                    activePage={page}
                    displayLength={displayLength}
                    total={updateofficer.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                  />
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

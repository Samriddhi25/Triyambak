import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from "react-router-dom";
import firebase from "firebase";
import { firestore as db } from '../../firebase/firebase';
import UserData from '../../component/userdata/userdata.js';
import 'rsuite/dist/styles/rsuite-default.css';
import { Table, Button } from 'rsuite';
import './officerscreen.css'

const { Column, HeaderCell, Cell, Pagination } = Table;

export default function OfficerModal(props) {

  const moment = require('moment');
  const history = useHistory()
  const { userId } = useParams()
  const [cases, updateCase] = useState(null)
  const [users, updateUsers] = useState([])

  const [displayLength, setDisplayLength] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()

  useEffect(() => {
    // console.log(userId);
    db.collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return alert('No user with this ID')
        } else {
          updateUsers(() => doc.data())
        }
        const CaseData = doc.data().cases
        const size = doc.data().cases.length

        myCase(CaseData, size)
      })
  }, [userId])

  // console.log(users)

  function myCase(CaseData, size) {
    // // console.log(size);
    // // console.log(CaseData);

    if (size >= 1) {
      if (CaseData.length !== 0) {
        updateCase(() => [])
        CaseData.forEach(caseId => {
          // console.log(caseId);
          db
            .collection('cases')
            .doc(caseId)
            .get()
            .then(doc =>
              updateCase(prevState => [
                ...prevState,
                { ...doc.data(), caseId: doc.id }
              ]),
              // console.log(cases)
            )
        })
      }
    }
    else {
      return "no case data found"
    }
  }

  function getCaseData() {
    const mycasedata = cases.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })

    if (sortColumn && sortType) {
      return mycasedata.sort((a, b) => {
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
    return mycasedata
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

  return (
    <div className='cases'>
      <div class='main'>
        <div className='mypage'>
          <h2 className='title'>Officer Details</h2>
          <div className='containe'>
            <UserData key={users.userId} {...users} />
          </div>
          <br />
          <br />
          <br />
          {
           (cases === null || cases.length === 0) ? "No Case yet" :
              <div>
                <h3 className='title'>Officer's Current Cases</h3>
                <div className='subofficer'>
                  <Table
                    autoHeight
                    rowHeight={60}
                    data={getCaseData()}
                    sortColumn={sortColumn}
                    sortType={sortType}
                    onSortColumn={handleSortColumn}
                    loading={loading}
                    onRowClick={data => {
                      history.push(`/cases/${data.caseId}`)
                    }}
                  >
                    <Column width={180} align="justify" sortable>
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Case Id</HeaderCell>
                      <Cell dataKey="caseId" />
                    </Column>

                    <Column width={150} align="justify" sortable>
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Case Location</HeaderCell>
                      <Cell dataKey="area" />
                    </Column>

                    <Column width={250} align="justify" sortable>
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Created At</HeaderCell>
                      <Cell>
                      {rowData => {
                      const stamp = rowData.timestamp;
                   const time = moment(stamp).format('MMMM Do, YYYY - h:mm:ss A ');
                      return (time)
                    }}
                      </Cell>
                    </Column>

                    <Column width={250} align="center">
                      <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Verified</HeaderCell>
                      <Cell>
                        {rowData => {
                          if (rowData.verified == true) return "Yes"
                          else return "No"
                        }}
                      </Cell>
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
                    total={cases.length}
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

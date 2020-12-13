import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory, Link } from "react-router-dom";
import firebase from "firebase";
import { auth, firestore as db } from '../../firebase/firebase';
import 'rsuite/dist/styles/rsuite-default.css';
import { Table, Button, Avatar, Icon } from 'rsuite';
import './filelogs.css'

const { Column, HeaderCell, Cell, Pagination } = Table;

export default function FileLogs(props) {

  const moment = require('moment');
  const [logs, setLogs] = useState([])
  const [displayLength, setDisplayLength] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()

  useEffect(() => {
    db.collection('LOGS')
      .get()
      .then(snapshot =>
        setLogs(
          snapshot.docs
            .map(doc => ({ ...doc.data(), eventId: doc.id }))
        )
      )
  }, [])

  function getData() {
    const data = logs.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })

    if (sortColumn && sortType) {
      return data.sort((a, b) => {
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
    return data
  }

  function handleChangePage(dataKey) {
    setPage(dataKey)
  }

  function handleChangeLength(dataKey) {
    setPage(1)
    setDisplayLength(dataKey)
  }

  function handleSortColumn(sortColumn, sortType) {
    setLoading(true)

    setTimeout(() => {
      setSortColumn(sortColumn)
      setSortType(sortType)
      setLoading(false)
    }, 500)
  }

  const history = useHistory()

  if (!logs) return <div>L O A D I N G . . .</div>

  return (
    <div className='cases'>
      <Table
        autoHeight
        wordWrap
        rowHeight={60}
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
      >
        <Column width={80} align="justify" >
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}></HeaderCell>
          <Cell><Avatar circle><Icon icon="user" /></Avatar></Cell>
        </Column>

        <Column width={130} align="justify" sortable>
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Log of User</HeaderCell>
          <Cell dataKey="userId" />
        </Column>

        <Column width={130} align="justify" sortable>
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>IP Address</HeaderCell>
          <Cell dataKey="ip" />
        </Column>

        <Column width={250} align="justify" sortable>
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Log Time</HeaderCell>
          <Cell>
            {rowData => {
              if(rowData.timestamping.seconds == undefined || rowData.timestamping == null) {
                const stamp = rowData.timestamping;
                const time = moment(stamp).format('YYYY - h:mm:ss A ');
                return ( "December 12th, " + time)
              }
              else {
                const stamp = rowData.timestamping;
                const time = stamp.toDate()
                const next =  time.toString()
                return (next)
              }
            }}
          </Cell>
        </Column>
        <Column width={380} align="justify">
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Log Message</HeaderCell>
          <Cell dataKey="message" />
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
        total={logs.length}
        onChangePage={handleChangePage}
        onChangeLength={handleChangeLength}
      />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { firestore as db } from "../../firebase/firebase";
import 'rsuite/dist/styles/rsuite-default.css';
import { Table, Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import './volunteerscreen.css'

const { Column, HeaderCell, Cell, Pagination } = Table;

export default function VolunteerScreen(props) {
  
  const [users, updateUsers] = useState([])
  const [displayLength, setDisplayLength] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()

  useEffect(() => {
    db.collection('users')
      .get()
      .then(snapshot =>
        updateUsers(
          snapshot.docs
            .filter(doc => doc.data().role === 'volunteer')
            .map(doc => ({ ...doc.data(), userId: doc.id }))
        )
      )
  }, [])
  
  function handleChangePage(dataKey) {
    setPage(dataKey)
  }

  function handleChangeLength(dataKey) {
    setPage(1)
    setDisplayLength(dataKey)
  }

  function getData() {
    const data = users.filter((v, i) => {
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

  function handleSortColumn(sortColumn, sortType) {
    setLoading(true)

    setTimeout(() => {
      setSortColumn(sortColumn)
      setSortType(sortType)
      setLoading(false)
    }, 500)
  }

  const history = useHistory()

  return (
    <div className='volunteer'>
      <Table
        autoHeight
        rowHeight={60}
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        onRowClick={data => {
          history.push(`/volunteer/${data.userId}`)
        }}
        >
        <Column width={250} align="justify" sortable>
          <HeaderCell style={{color:"black",fontSize:"medium", fontWeight:"600"}}>Full Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={200} align="justify" sortable>
          <HeaderCell style={{color:"black",fontSize:"medium", fontWeight:"600"}}>Volunteer ID</HeaderCell>
          <Cell dataKey="userId" />
        </Column>

        <Column width={250} align="justify" sortable>
          <HeaderCell style={{color:"black",fontSize:"medium", fontWeight:"600"}}>Contact</HeaderCell>
          <Cell dataKey="contact" />
        </Column>
        <Column width={150} align="justify">
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Cases Assigned</HeaderCell>
          <Cell>
          {rowData => {
            return (
              rowData.cases.length
            )
          } }
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
        total={users.length}
        onChangePage={handleChangePage}
        onChangeLength={handleChangeLength}
      />
    </div>
  )
}

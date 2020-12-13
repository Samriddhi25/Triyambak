import React, { useState, useEffect } from 'react'
import { auth, firestore as db } from "../../firebase/firebase";
import 'rsuite/dist/styles/rsuite-default.css';
import { Table, Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import './volunteerlogs.css';

const { Column, HeaderCell, Cell, Pagination } = Table;

export default function VolunteerLogs(props) {

  const user = auth.currentUser;
  const userId = user.email;
  const [cases, updateCases] = useState([])
  const [displayLength, setDisplayLength] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()

  useEffect(() => {

    db
      .collection('users')
      .doc(userId.substring(0,7))
      .get()
      .then(doc => {
        if (!doc.exists) {
          return alert('No case assigned')
        }
        else {
          const CaseData = doc.data().cases
          const size = doc.data().cases.length
          if (size >= 1) {
            if (CaseData.length !== 0) {
              updateCases(() => [])
              CaseData.forEach(caseId => {
                // console.log(caseId);
                db
                  .collection('cases')
                  .doc(caseId)
                  .get()
                  .then(doc =>
                    updateCases(prevState => [
                      ...prevState,
                      { ...doc.data(), caseId: doc.id }
                    ]),
                    // console.log(cases)
                  )
              })
            }
          }
          return "no case data found"
        }
      })
  }, [])

  function handleChangePage(dataKey) {
    setPage(dataKey)
  }

  function handleChangeLength(dataKey) {
    setPage(1)
    setDisplayLength(dataKey)
  }

  function getData() {
    const data = cases.filter((v, i) => {
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
    <div className='cases'>
      <Table
        autoHeight
        rowHeight={60}
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        onRowClick={data => {
          history.push(`/edit/${data.caseId}`)
        }}
      >
        <Column width={150} align="justify" sortable>
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Case ID</HeaderCell>
          <Cell dataKey="caseId" />
        </Column>

        <Column width={250} align="justify" sortable>
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Case Location</HeaderCell>
          <Cell dataKey="area" />
        </Column>

        <Column width={150} align="justify">
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Verified</HeaderCell>
          <Cell>
            {rowData => {
              if (rowData.verified == true) return "Yes"
              else return "No"
            }}
          </Cell>
        </Column>
        <Column width={300} align="justify">
          <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Assigned</HeaderCell>
          <Cell>
            {rowData => {
              if (rowData.users) return "Yes"
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
  )
}

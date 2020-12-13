import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory, Link } from "react-router-dom";
import firebase from "firebase";
import { firestore as db } from '../../firebase/firebase';
import 'rsuite/dist/styles/rsuite-default.css';
import { Table, Button } from 'rsuite';
import CaseData from '../../component/casedata/casedata.js';
import './homepage.css'

const { Column, HeaderCell, Cell, Pagination } = Table;


export default function Documents(props) {

  const moment = require('moment');
  const history = useHistory()
  const { caseId } = useParams()
  const [cases, updateCase] = useState([])
  const [images, updateImages] = useState([])

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
        updateCase(() => doc.data())

        const ImgData = doc.data().images
        myImg(ImgData)
      })


  }, [caseId])

  function myImg(Data) {

    if (Data.length !== 0) {
      updateImages(() => [])
      Data.forEach(imageId => {

        db
          .collection('IMAGES')
          .doc(imageId)
          .get()
          .then(doc =>
            updateImages(prevState => [
              ...prevState,
              { ...doc.data(), caseId: doc.id },
            ])
          )
      })
    }
  }

function getData() {
  const mycasedata = images.filter((v, i) => {
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

if (!cases) return <div>Loading...</div>
if (!images) return <div>Loading...</div>

return (
  <div className='cases'>
    <div class='main'>
      <div className='mypage'>
        <div>
          <h2 className='title'>Details to Check</h2>
          {
            <div className='photo'>
              <Table
                autoHeight
                rowHeight={60}
                data={getData()}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                loading={loading}
                onRowClick={data => {
                  history.push(`/change/${data.imageId}`)
                }}
              >
                 <Column width={150} align="justify" sortable>
                    <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Type</HeaderCell>
                    <Cell>Image </Cell>
                  </Column>

                  <Column width={200} align="justify" sortable>
                    <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Image tampered</HeaderCell>
                    <Cell>
                      {rowData => {
                        if (rowData.tampered == false) return "No"
                        else return "Yes"
                      }}
                    </Cell>
                  </Column>

                  <Column width={230} align="justify" sortable>
                    <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Created At</HeaderCell>
                    <Cell >
                      {rowData => {
                        const stamp = rowData.timestamp;

                        const time = moment(stamp).format('MMMM Do, YYYY - h:mm:ss A ');
                        return (time)
                      }}
                    </Cell>
                  </Column>

                  <Column width={200} align="justify" sortable>
                    <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Image Location</HeaderCell>
                    <Cell>
                      {rowData => {

                        const latitude = rowData.location.lat;
                        const longitude = rowData.location.lon;
                        const location = "lat: " + latitude + " lon: " + longitude;
                        console.log(location)
                        return location
                      }}
                    </Cell>
                  </Column>


                  <Column width={150} align="center">
                    <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Captured By</HeaderCell>
                    <Cell dataKey="userId" />
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
                total={images.length}
                onChangePage={handleChangePage}
                onChangeLength={handleChangeLength}
              />

            </div>}
        </div>

      </div>
    </div>
  </div>
)
}
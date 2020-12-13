import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './casedata.css'

export default function CaseData(props) {

  const moment = require('moment');
  var stamp = props.timestamp;
  var time = moment(stamp).format('MMMM Do, YYYY - h:mm:ss A ');

  return (
    <div>
         <div className='mainn'>
        <div>
          <link href='https://fonts.googleapis.com/css?family=Montserrat' />
          <link href='https://fonts.googleapis.com/css?family=Questrial' />
          <table>
            <tr>
              <td>
                {' '}
                <h4>Case Id: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6>{props.caseId}</h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Case area: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6> {props.area}</h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Description: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6> {props.description}</h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Created At: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6>{time} </h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Approved : </h4>{' '}
              </td>
              <td>
                {' '}
                <h6>{props.verified == true ? "Yes" : "No"}</h6>{' '}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  )
}

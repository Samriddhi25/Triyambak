import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './userdata.css'

export default function UserData(props) {
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
                <h4>Name: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6>{props.name}</h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Official id: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6> {props.userId}</h6>{' '}
              </td>
            </tr>
            
            <tr>
              <td>
                {' '}
                <h4>Email: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6>{props.email} </h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Phone: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6>{props.contact} </h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Current Role: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6> {props.role}</h6>{' '}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <h4>Servive station: </h4>{' '}
              </td>
              <td>
                {' '}
                <h6>{props.station} </h6>{' '}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  )
}

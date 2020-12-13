import React from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'

export default function SideBar(props) {
  if (props.team === "volunteer") {
    return (
      <div className='side'>
        <br></br>
        <div>
          <Link to={'/'}>
            <button className='testbar'>CASE LOGS</button>
          </Link>
        </div>
        <div>
          <Link to={'/profile'}>
            <button className='testbar'>MY INFO</button>
          </Link>
        </div>
      </div>
    )
  } else if (props.team === "officer") {
    return (
      <div className='side'>
        <br></br>
        <div>
          <Link to={'/'}>
            <button className='testbar'>CASE LOGS</button>
          </Link>
        </div>
        <div>
          <Link to={'/profile'}>
            <button className='testbar'>MY INFO</button>
          </Link>
        </div>
      </div>
    )
  } else if (props.team === "admin") {
    return (
      <div className='side'>
        <br></br>
        <div>
          <Link to={'/'}>
            <button className='testbar'>CASE LOGS</button>
          </Link>
        </div>
        <div>
          <Link to={'/officer'}>
            <button className='testbar'>OFFICERS</button>
          </Link>
        </div>
        <div>
          <Link to={'/volunteer'}>
            <button className='testbar'>VOLUNTEERS</button>
          </Link>
        </div>
        <div>
          <Link to={'/logs'}>
            <button className='testbar'>SYSTEM LOGS</button>
          </Link>
        </div>
        <div>
          <Link to={'/member'}>
            <button className='testbar'>ADD MEMBER</button>
          </Link>
        </div>
        <div>
          <Link to={'/profile'}>
            <button className='testbar'>MY INFO</button>
          </Link>
        </div>
      </div>
    )
  }
}
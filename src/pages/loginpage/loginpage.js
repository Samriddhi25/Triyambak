import React, { Component } from 'react'
import './loginpage.css'
import auth from '../../firebase/firebase'
import logo from '../../wow.png'
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
)

class Login extends Component {
  constructor() {
    super()

    this.state = {
      email: null,
      password: null,
      errors: {
        email: '',
        password: ''
      }
    }
  }

  handleChange = e => {
    const { value, name } = e.target
    let errors = this.state.errors

    switch (name) {
      case 'email':
        if (value.length === 0) {
          errors.email = 'Please enter your email'
        } else if (!validEmailRegex.test(value)) {
          errors.email = 'Email format is invalid'
        } else {
          errors.email = ''
        }
        break
      case 'password':
        if (value.length === 0) {
          errors.password = 'Please enter your password'
        } else if (value.length < 8) {
          errors.password = 'Must be at least 8 characters long'
        } else {
          errors.password = ''
        }
        break
      default:
        break
    }

    this.setState({ errors, [name]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => { })
      .catch(error => {
        console.log(error)
        alert('You have entered wrong email or password')
      })
  }

  render() {
    const { errors } = this.state
    return (
      <div className='mainpage'>
        <div className='loginform'>
          <center>
            <img src={logo} alt='logo' className='log'></img>
          </center>
          <link href='https://fonts.googleapis.com/css?family=Montserrat' />
          <form className='form' noValidate>
            <h1
              className='h1a'
              align='center'
              style={{ fontFamily: 'Montserrat' }}
            >
              LOGIN
          </h1>
            <br />
            <div className='email'>
              {errors.email.length > 0 && (
                <span className='error'>{errors.email}</span>
              )}
              <input
                type='email'
                name='email'
                className='input'
                onChange={this.handleChange}
                noValidate
                placeholder='Email'
              />
            </div>
            <div className='password'>
              {errors.password.length > 0 && (
                <span className='error'>{errors.password}</span>
              )}
              <input
                className='input'
                type='password'
                name='password'
                onChange={this.handleChange}
                noValidate
                placeholder='Password'
              />
            </div>
            <br />
            <button
              onClick={this.handleSubmit}
              type='submit'
              className='login-btn'
            >
              Login
          </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login

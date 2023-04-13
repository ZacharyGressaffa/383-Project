import React, { Component } from 'react'
import SMOKE_Other from './SMOKE_Other.png'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'


class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    LoggingOut = () => {
        axios.post('./api/authentication/logout').then(response => {
            this.setState({ isLoggedIn: false })
        })
    }


    render() {
        return (
            <Navbar bg='dark' variant='dark' sticky='top'>
                <a className='home' href='/'>
                    <img src={SMOKE_Other} className="smoke" alt='' />
                    Smoke
                </a>
                <Nav>
                    <Nav.Link href='/'>Products</Nav.Link>
                </Nav>
                <NavDropdown align='end' className='ms-auto' title={<i class="fa-solid fa-2x fa-circle-user"></i>}>
                    <NavDropdown.Item href='login'><i class="fa-solid fa-circle-user"></i> Login</NavDropdown.Item>
                    <NavDropdown.Item href='register'><i class="fa-solid fa-user-plus"></i> Register</NavDropdown.Item>
                </NavDropdown>
            </Navbar>
        )
    }
}

export default Navigation
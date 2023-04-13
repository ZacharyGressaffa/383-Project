import React from 'react'
//import './Navbars.css'
import SMOKE_Other from './SMOKE_Other.png'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Nav, Navbar, NavDropdown, Button } from 'react-bootstrap'


function UserNavbar(props) {

    const LoggingOut = () => {
        axios.post('./api/authentication/logout').then(response => {
            props.setLogin(false)
        })
    }


    return (
        <Navbar bg='dark' variant='dark' sticky='top'>
            <a className='home' href='/'>
                <img src={SMOKE_Other} className="smoke" alt='' />
                Smoke
            </a>
            <Nav>
                <Nav.Link href='/'>Products</Nav.Link>
                <NavDropdown align='end' className='ms-auto' title={<i class="fa-solid fa-2x fa-circle-user"></i>}>
                    <NavDropdown.Item href='manageproducts'><i class="fa-solid fa-box"></i> Active Library</NavDropdown.Item>
                    <NavDropdown.Item href='fulllibrary'><i class="fa-solid fa-boxes-stacked"></i> Full Library</NavDropdown.Item>
                    <Button href='/' className='btn' variant='danger' onClick={() => LoggingOut()}>Logout</Button>
                </NavDropdown>
            </Nav>
        </Navbar>
    )

}

export default UserNavbar
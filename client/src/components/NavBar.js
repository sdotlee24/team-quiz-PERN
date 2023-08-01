import React from 'react'
// import Auth from './Auth.js'
import {Link} from 'react-router-dom'


export const Navbar = () => {
   


    return (<div className='navbar'>
        <Link to="/" className="nav">Home</Link>
        <Link to="/about" className='nav'>About</Link>
        {/* {cookies.access_token && <Link to="/history" className='nav'>Bet History</Link>} */}
        {/* <Auth className="auth2"/> */}
    </div>)
}
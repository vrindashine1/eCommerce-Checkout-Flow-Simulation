
import React from 'react';
import {
    Link
} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return ( <nav className = "navbar" >
        <div className = "navbar-brand" >
        <Link to = "/" > eCommerce  </Link> 
        </div> <ul className = "navbar-links" >
        <li >
        <Link to = "/" > Home </Link> </li> 
        <li>
        <Link to = "/catalog" > Catalog </Link> 
        </li> 
        <li>
        <Link to = "/contact" > Contact </Link> 
        </li> 
        </ul> 
        <div className = "navbar-icons" >
        <i className = "fas fa-search" > </i> 
        <i className = "fas fa-user" > </i> 
        <div className = "cart-icon" >
        <i className = "fas fa-shopping-bag" > </i> 
        <span className = "cart-count" > 0 </span> 
        </div> 
        </div> 
        </nav>
    );
};

export default Navbar


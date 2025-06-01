import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import Navbar from './components/Navbar';
import './index.css'; // For global styles

function App() {
    return ( <
        Router >
        <
        Navbar / >
        <
        div className = "container" >
        <
        Routes >
        <
        Route path = "/"
        element = {
            < LandingPage / >
        }
        /> <
        Route path = "/checkout"
        element = {
            < CheckoutPage / >
        }
        /> <
        Route path = "/thank-you/:orderNumber"
        element = {
            < ThankYouPage / >
        }
        /> </Routes> 
        </div> </Router>
    );
}

export default App;


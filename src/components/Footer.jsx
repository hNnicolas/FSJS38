import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <p>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    &copy; 2024 DemonSlayerE-Book.com. All rights reserved.
                </Link>
            </p>
            <div className="footer-links">
                <a href="/privacy-policy">Privacy Policy</a>
                <span>|</span> 
                <a href="/terms-of-use">Terms of Use</a>
            </div>
        </footer>
    )
}

export default Footer

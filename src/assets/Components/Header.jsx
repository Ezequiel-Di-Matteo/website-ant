import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.classList.toggle('open', isMenuOpen);
    }
  }, [isMenuOpen]);

  return (
    <header>
      <div className="head-div">
        <div className="head-title">
          <Link to="/">
            <h1>Antagon</h1>
          </Link>
        </div>

        <div id="menuIcon" onClick={toggleMenu}>
          <i className={`fa-solid ${isMenuOpen ? 'fa-x' : 'fa-bars'}`}></i>
        </div>

        <nav className={isMenuOpen ? 'open' : ''}>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}><Link to="/">Home</Link></li>
            <li className={location.pathname === '/about' ? 'active' : ''}><Link to="/about">About</Link></li>
            <li className={location.pathname === '/wallet' ? 'active' : ''}><Link to="/wallet">Wallet</Link></li>
            <li className={location.pathname === '/trade' ? 'active' : ''}><Link to="/trade">Trade</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
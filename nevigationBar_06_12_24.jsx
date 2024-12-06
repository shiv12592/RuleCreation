import React, { useState } from 'react';

const SecondaryNavBar = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName); // Highlight the parent menu when a dropdown item is selected
  };

  return (
    <header className="secondary-navigation">
      <ul className="secondary-nav-menu">
        {/* Home Menu */}
        <li
          className={`secondary-nav-item ${selectedMenu === 'home' ? 'active' : ''}`}
          onClick={() => handleMenuClick('home')}
        >
          <a href="#home" className="secondary-nav-link">
            Home
          </a>
        </li>

        {/* Actions Menu */}
        <li
          className={`secondary-nav-item dropdown ${selectedMenu === 'actions' ? 'active' : ''}`}
        >
          <a href="#actions" className="secondary-nav-link dropdown-toggle">
            Actions
          </a>
          <ul className="dropdown-menu secondary-dropdown">
            <li className="dropdown-item">
              <a href="#attestation" onClick={() => handleMenuClick('actions')}>
                Attestation
              </a>
            </li>
            <li className="dropdown-item">
              <a href="#execution" onClick={() => handleMenuClick('actions')}>
                Execution
              </a>
            </li>
          </ul>
        </li>

        {/* Audit Menu */}
        <li
          className={`secondary-nav-item dropdown ${selectedMenu === 'audit' ? 'active' : ''}`}
        >
          <a href="#audit" className="secondary-nav-link dropdown-toggle">
            Audit
          </a>
          <ul className="dropdown-menu secondary-dropdown">
            <li className="dropdown-item">
              <a href="#audit-logs" onClick={() => handleMenuClick('audit')}>
                Audit Logs
              </a>
            </li>
            <li className="dropdown-item">
              <a href="#audit-info" onClick={() => handleMenuClick('audit')}>
                Audit Info
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
};

export default SecondaryNavBar;



:global {
    
/* Secondary Navigation Styling */
.secondary-navigation {
    background-color: #f4f4f4; /* Light background */
    padding: 10px 20px;
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
  }
  
  .secondary-nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: space-around;
  }
  
  .secondary-nav-item {
    position: relative;
  }
  
  .secondary-nav-link {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    padding: 8px 15px;
    transition: color 0.3s ease, background-color 0.3s ease;
  }
  
  
  .secondary-nav-link:hover {
    color: #007bff; /* Blue hover color */
  }
  
/* Dropdown Styling */
.dropdown-menu.secondary-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 9999; /* High priority over other elements */
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 10px;
    margin: 0;
    border: 1px solid #ddd;
    min-width: 200px; /* Ensure enough width */
  }
  .secondary-navigation {
    position: relative; /* Ensures the dropdown is positioned relative to this container */
  }
  
  .dropdown-item {
    margin: 5px 0;
  }
  
/* Dropdown link styling */
.dropdown-link {
    text-decoration: none;
    color: #333;
    padding: 10px 15px;
    display: block;
  }
  
  .dropdown-link:hover {
    color: #007bff;
    background-color: #f0f0f0;
  }
  /* Show dropdown on hover */
  .secondary-nav-item.dropdown:hover .dropdown-menu.secondary-dropdown {
    display: block;
  }
  .secondary-nav-item.active .secondary-nav-link {
    color: #fff; /* Highlighted text color */
    background-color: #007bff; /* Highlighted background color */
    border-radius: 5px; /* Optional: Rounded corners for the highlight */
  }
  .dropdown-menu.secondary-dropdown .dropdown-item a {
    color: #333;
  }

  .dropdown-menu.secondary-dropdown .dropdown-item a:hover {
    color: #007bff;
  }
  
}

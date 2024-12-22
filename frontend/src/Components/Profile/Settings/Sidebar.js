import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./sidebar.css"

const Sidebar = () => {
  return (
    <>
      <div className="sidebar  p-3 bg-light rounded">
        <h5 className="mb-4 p-2">Settings</h5>
        <hr></hr>
        <ul className="list-unstyled">
          <li className='mb-3'>
            <NavLink
              to="#"
              className={({ isActive }) =>
                isActive
                  ? 'd-flex align-items-center text-decoration-none text-dark ps-2 border-start border-primary border-3'
                  : 'd-flex align-items-center text-decoration-none text-dark ps-2'
              }
            >
              <i className="bx bx-user-circle "></i> <span className='p-2'>Profile</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings/account"
              className={({ isActive }) =>
                isActive
                  ? 'd-flex align-items-center text-decoration-none text-dark ps-2 border-start border-primary border-3'
                  : 'd-flex align-items-center text-decoration-none text-dark ps-2'
              }
            >
              <i class='bx bxs-key'></i> <span className='p-2'>Account</span>
            </NavLink>
          </li>

        </ul>

      </div>

    </>

  );
};

export default Sidebar;

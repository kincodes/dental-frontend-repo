import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Navbars.css";

const Navbars = () => {
  
  return (
    <div>
      <Navbar bg="clear" expand="md" className=" d-flex justify-content-end">
        <Navbar.Brand as={Link} to="/">
          {" "}
          West Point Dental
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-options ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/patient">
              Patients
            </Nav.Link>
            <Nav.Link as={Link} to="/schedule">
              Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/appointment">
              Appointment
            </Nav.Link>
            <Nav.Link as={Link} to="/employee">
              Employee
            </Nav.Link>

            <Nav.Link className="logout-button" as={Link} to="/logout">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Navbars;

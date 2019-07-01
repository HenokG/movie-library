import React from "react";
import "./Header.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Auth from "../authentication/Auth";

class Header extends React.Component {
  render() {
    let navItems;
    if (Auth.isAuthenticated()) {
      navItems = (
        <Nav className="mr-auto">
          <LinkContainer to="/all">
            <Nav.Link>All</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/shared">
            <Nav.Link>Shared</Nav.Link>
          </LinkContainer>
        </Nav>
      );
    } else {
      navItems = (
        <Nav className="mr-auto">
          <LinkContainer to="/login">
            <Nav.Link>LogIn</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/signup">
            <Nav.Link>SignUp</Nav.Link>
          </LinkContainer>
        </Nav>
      );
    }
    return (
      <Navbar bg="primary" variant="dark">
        <LinkContainer to="/home">
          <Navbar.Brand href="#home">Movie Library</Navbar.Brand>
        </LinkContainer>
        {navItems}
      </Navbar>
    );
  }
}

export default Header;

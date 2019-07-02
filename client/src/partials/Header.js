import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Auth from "../authentication/Auth";

/**
 * Header component for rendering the header
 * of the entire app
 *
 * renders specific headers based on user
 * authentication
 *
 * @class Header
 * @extends {React.Component}
 */
class Header extends React.Component {
  /**
   * logout a user by deleting the token from
   * localStorage
   *
   * @memberof Header
   */
  logout() {
    localStorage.removeItem("loggedInUser");
    window.location.reload();
  }

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
          <Nav.Link className="ml-auto" onClick={this.logout}>
            Log Out
          </Nav.Link>
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

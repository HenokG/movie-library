import React, { Component } from "react";
import App from "../App";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Config from "../utils/config";
import to from "../utils/to";
import Auth from "./Auth";

/**
 * LogIn component for user authentication which
 * also serves as the homepage
 *
 * @class LogIn
 * @extends {Component}
 */
class LogIn extends Component {
  /**
   * Creates an instance of LogIn.
   * @param {*} props
   * @memberof LogIn
   */
  constructor(props) {
    super(props);

    // user authenticated? then redirect to movies page(ie /)
    if (Auth.isAuthenticated()) props.history.push("/");

    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);

    this.state = {
      error: null
    };
  }

  /**
   * a single input change handler for all inputs which sets
   * state based on the input's name and current value
   *
   * @param {*} event
   * @memberof LogIn
   */
  handleInputChanges(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * asynchronously authenticate user with backend API
   * and redirect if credentials are a match
   *
   * @param {*} event
   * @memberof LogIn
   */
  async handleLogIn(event) {
    event.preventDefault();
    // send POST login request to API server
    const [error, response] = await to(
      axios.post(`${Config.API_URL}/users/login`, this.state)
    );
    if (error) return this.setState({ error: "invalid credentials" });
    this.setState({ error: null });
    // save user token & username in localStorage for subsequent requests
    localStorage.setItem("loggedInUser", JSON.stringify(response.data));
    this.props.history.push("/");
  }

  render() {
    return (
      <App>
        <div className="d-flex justify-content-center">
          <Form className="m-5 mx-auto bg-white px-5 pb-3 pt-4">
            <h2> LogIn Form </h2>
            <Form.Row>
              <Form.Group controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={this.handleInputChanges}
                  placeholder="Enter email"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={this.handleInputChanges}
                  placeholder="Enter password"
                />
              </Form.Group>
            </Form.Row>

            <div className="text-danger mb-2">{this.state.error}</div>

            <Button variant="primary" type="submit" onClick={this.handleLogIn}>
              Log In
            </Button>
          </Form>
        </div>
      </App>
    );
  }
}

export default LogIn;

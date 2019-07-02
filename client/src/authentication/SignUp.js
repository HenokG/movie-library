import React, { Component } from "react";
import App from "../App";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Config from "../utils/config";
import to from "../utils/to";
import Auth from "./Auth";

/**
 * SignUp component for adding users
 *
 * @class SignUp
 * @extends {Component}
 */
class SignUp extends Component {
  /**
   *Creates an instance of SignUp.
   * @param {*} props
   * @memberof SignUp
   */
  constructor(props) {
    super(props);

    // user authenticated?
    if (Auth.isAuthenticated()) props.history.push("/");

    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);

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
   * asynchronously send new user credentials to backend API
   *
   * if credentials are unique and valid server
   * will send no errors, indicating we
   * redirect to /login
   *
   * @param {*} event
   * @memberof LogIn
   */
  async handleSignUp(event) {
    event.preventDefault();
    const [error] = await to(
      axios.post(`${Config.API_URL}/users/signup`, this.state)
    );
    if (error) return this.setState({ error: "invalid credentials" });
    this.setState({ error: null });
    this.props.history.push("/login");
  }

  render() {
    return (
      <App>
        <div className="d-flex justify-content-center">
          <Form className="m-5 mx-auto bg-white px-5 pb-3 pt-4">
            <h2> SignUp Form </h2>
            <Form.Row className="mt-4">
              <Form.Group controlId="formGridUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="username"
                  name="username"
                  onChange={this.handleInputChanges}
                  placeholder="Enter username"
                />
              </Form.Group>
            </Form.Row>
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

            <Button variant="primary" type="submit" onClick={this.handleSignUp}>
              Submit
            </Button>
          </Form>
        </div>
      </App>
    );
  }
}

export default SignUp;

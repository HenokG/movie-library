import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default class ModalNotification extends Component {
  constructor() {
    super();

    this.handleNotificationToggle = this.handleNotificationToggle.bind(this);

    this.state = {
      show: false
    };
  }

  handleNotificationToggle() {
    this.setState({ show: !this.state.show });
  }

  render() {
    return (
      <Modal show={this.state.show}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>&#10004; Completed Successfully!</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={this.handleNotificationToggle}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

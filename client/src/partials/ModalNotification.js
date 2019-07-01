import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default class ModalNotification extends Component {
  constructor(props) {
    super(props);

    this.handleNotificationToggle = this.handleNotificationToggle.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.done = this.done.bind(this);

    this.state = {
      show: false,
      title: props.title
    };
  }

  setTitle({ title }) {
    this.setState({ title: title });
  }

  handleNotificationToggle() {
    this.setState({ show: !this.state.show });
  }

  done() {
    this.setState({ show: !this.state.show });
    window.location.reload();
  }

  render() {
    return (
      <Modal show={this.state.show} onHide={this.handleNotificationToggle}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>&#10004; Completed Successfully!</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={this.done}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

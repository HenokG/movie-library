import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 * ModalNotification component which is used to
 * notify users of some success/failure
 * scenarios
 *
 * @class ModalNotification
 * @extends {Component}
 */
class ModalNotification extends Component {
  /**
   * Creates an instance of ModalNotification.
   * @param {*} props
   * @memberof ModalNotification
   */
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

  /**
   * set title of notification modal
   *
   * @param {object} { title }
   * @memberof ModalNotification
   */
  setTitle({ title }) {
    this.setState({ title: title });
  }

  /**
   * toggle notification modal
   *
   * @memberof ModalNotification
   */
  handleNotificationToggle() {
    this.setState({ show: !this.state.show });
  }

  /**
   * when user clicks done refresh page
   * for updated data
   *
   * @memberof ModalNotification
   */
  done() {
    this.setState({ show: !this.state.show });
    // window.location.reload();
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

export default ModalNotification;

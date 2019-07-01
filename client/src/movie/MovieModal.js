import React, { Component } from "react";
import ModalNotification from "../partials/ModalNotification";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Movie from "./Movie";
import Modal from "react-bootstrap/Modal";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";

export default class MovieModal extends Component {
  constructor() {
    super();

    this.notification = React.createRef();

    this.handleToggle = this.handleToggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddSubmit = this.handleAddSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      show: false,
      error: null
    };
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleToggle() {
    this.setState({ show: !this.state.show });
  }

  handleAddSubmit() {
    this.handleSubmit({ method: "POST" });
  }

  handleEditSubmit() {
    this.handleSubmit({ method: "PUT" });
  }

  async handleSubmit({ method }) {
    switch (method) {
      case "POST":
        const [error, response] = await to(
          customAxios.post("/movies", this.state)
        );
        break;
      case "PUT":
        const [error, response] = await to(
          customAxios.put("/movies", this.state)
        );
        break;
      default:
        const [error, response] = await to(
          customAxios.delete("/movies", this.state)
        );
    }
    if (error)
      return this.setState({
        error: "operation failed"
      });

    this.setState({ showAddMovieModal: false });

    if (response.status === 200)
      this.movieAddedNotification.current.handleNotificationToggle();
  }

  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title>Add a Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              onChange={this.handleInputChange}
              placeholder="Title"
              className="mb-2"
            />

            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="duration"
              onChange={this.handleInputChange}
              placeholder="Duration in hours (ex. 2.30)"
              className="mb-2"
            />

            <Form.Label>Release Date</Form.Label>
            <Form.Control
              type="date"
              name="releaseDate"
              onChange={this.handleInputChange}
              className="mb-2"
            />

            <Form.Label>Staring</Form.Label>
            <Form.Control
              type="text"
              name="actors"
              onChange={this.handleInputChange}
              placeholder="Actors separated by comma (ex. Evans, RDJ)"
              className="mb-2"
            />

            <div className="text-danger mb-2">{this.state.error}</div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="primary" onClick={this.handleMovieSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <ModalNotification title="Movie Added" ref={this.notification} />
      </>
    );
  }
}

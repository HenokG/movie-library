import React, { Component } from "react";
import ModalNotification from "../partials/ModalNotification";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";

/**
 * MovieModal component for editing/adding/deleting a movie
 *
 * @class MovieModal
 * @extends {Component}
 */
class MovieModal extends Component {
  /**
   * Creates an instance of MovieModal.
   * @param {*} props
   * @memberof MovieModal
   */
  constructor(props) {
    super(props);

    this.notification = React.createRef();

    this.handleToggle = this.handleToggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setTitle = this.setTitle.bind(this);

    this.state = {
      modalTitle: "",
      show: false,
      method: "POST",
      error: null,
      title: props.movie.title,
      duration: props.movie.duration,
      releaseDate: props.movie.releaseDate,
      actors: props.movie.actors
    };
  }

  /**
   * set title of the modal which depends
   * on the called state
   *
   * @param {*} { title }
   * @memberof MovieModal
   */
  setTitle({ title }) {
    this.setState({ modalTitle: title });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  /**
   * toggle movie modal
   *
   * @memberof MovieModal
   */
  handleToggle() {
    this.setState({ show: !this.state.show });
  }

  /**
   * show the modal for adding a new movie
   *
   * @memberof MovieModal
   */
  openAddModal() {
    this.setState({ method: "POST" });
    this.handleToggle();
  }

  /**
   * show the modal for editing a movie
   *
   * set notification's title to 'Edited'
   *
   * @param {string} id
   * @memberof MovieModal
   */
  openEditModal(id) {
    this.setState({ method: "PUT" });
    this.handleToggle();
    this.setState({ id: id });
    this.notification.current.setTitle({ title: "Edited" });
  }

  /**
   * show the modal for deleting a movie
   *
   *set notification's title to Deleted
   *
   * @param {*} id
   * @memberof MovieModal
   */
  openDeleteModal(id) {
    this.setState({ method: "DELETE" });
    this.handleToggle();
    this.setState({ id: id });
    this.notification.current.setTitle({ title: "Deleted" });
  }

  /**
   * asynchronously submit user action to server
   *
   * @memberof MovieModal
   */
  async handleSubmit() {
    let error, response;
    switch (this.state.method) {
      case "POST":
        [error, response] = await to(customAxios.post("/movies", this.state));
        break;
      case "PUT":
        [error, response] = await to(customAxios.put("/movies", this.state));
        break;
      default:
        [error, response] = await to(customAxios.patch("/movies", this.state));
    }
    if (error)
      return this.setState({
        error: "operation failed"
      });

    this.setState({ show: false });

    if (response.status === 200) {
      this.notification.current.handleNotificationToggle();
    }
  }

  render() {
    // format release date for input's value
    const releaseDateForInput = this.state.releaseDate
      ? this.state.releaseDate.substr(0, 10)
      : undefined;
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleToggle}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={this.state.method === "DELETE" ? "d-none" : ""}
          >
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleInputChange}
              placeholder="Title"
              className="mb-2"
            />

            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="duration"
              value={this.state.duration}
              onChange={this.handleInputChange}
              placeholder="Duration in hours (ex. 2.30)"
              className="mb-2"
            />

            <Form.Label>Release Date</Form.Label>
            <Form.Control
              type="date"
              name="releaseDate"
              value={releaseDateForInput}
              onChange={this.handleInputChange}
              className="mb-2"
            />

            <Form.Label>Staring</Form.Label>
            <Form.Control
              type="text"
              name="actors"
              value={this.state.actors}
              onChange={this.handleInputChange}
              placeholder="Actors separated by comma (ex. Evans, RDJ)"
              className="mb-2"
            />

            <div className="text-danger mb-2">{this.state.error}</div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button
              variant={this.state.method === "DELETE" ? "danger" : "primary"}
              onClick={this.handleSubmit}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <ModalNotification title="Movie Added" ref={this.notification} />
      </>
    );
  }
}

export default MovieModal;

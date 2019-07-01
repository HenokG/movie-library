import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Movie from "./Movie";
import Modal from "react-bootstrap/Modal";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";
import ModalNotification from "../partials/ModalNotification";

class MovieList extends Component {
  SORT = {
    SORT_BY_TITLE_A: 0,
    SORT_BY_TITLE_D: 1,
    SORT_BY_DURATION_A: 2,
    SORT_BY_DURATION_D: 3,
    SORT_BY_RELEASE_DATE_A: 4,
    SORT_BY_RELEASE_DATE_D: 5
  };

  constructor() {
    super();

    this.movieAddedNotification = React.createRef();

    this.handleSort = this.handleSort.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddMovieModalToggle = this.handleAddMovieModalToggle.bind(this);
    this.handleMovieSubmit = this.handleMovieSubmit.bind(this);

    this.state = {
      showAddMovieModal: false,
      error: null
    };
  }

  handleAddMovieModalToggle() {
    this.setState({ showAddMovieModal: !this.state.showAddMovieModal });
  }

  handleSort(event) {
    if (Number(event.target.value.length) !== 1) return;
    this.props.movies.sort((a, b) => a - b);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleMovieSubmit() {
    const [error, response] = await to(customAxios.post("/movies", this.state));
    if (error) return this.setState({ error: "operation failed" });

    this.setState({ showAddMovieModal: false });

    if (response.status === 200)
      this.movieAddedNotification.current.handleNotificationToggle();
  }

  render() {
    return (
      <Container>
        <h1 className="mt-3">{this.props.title}</h1>

        <Row className="mt-3">
          <Form className="form-inline">
            <Form.Group controlId="selectSort">
              <Form.Label className="mx-3">Sort By</Form.Label>
              <Form.Control
                as="select"
                className="custom-select"
                onChange={this.handleSort}
              >
                <option>Click here...</option>
                <option value={this.SORT["SORT_BY_TITLE_A"]}>
                  Title Ascending
                </option>
                <option value={this.SORT["SORT_BY_TITLE_D"]}>
                  Title Descending
                </option>
                <option value={this.SORT["SORT_BY_DURATION_A"]}>
                  Duration Ascending
                </option>
                <option value={this.SORT["SORT_BY_DURATION_D"]}>
                  Duration Descending
                </option>
                <option value={this.SORT["SORT_BY_RELEASE_DATE_A"]}>
                  Release Date Ascending
                </option>
                <option value={this.SORT["SORT_BY_RELEASE_DATE_D"]}>
                  Release Date Descending
                </option>
              </Form.Control>
              <Button
                className="ml-3"
                variant="primary"
                onClick={this.handleAddMovieModalToggle}
              >
                Add a Movie
              </Button>
            </Form.Group>
          </Form>
        </Row>

        <Row className="mt-3">
          {this.props.movies.length > 0 &&
            this.props.movies.map(movie => <Movie movie={movie} />)}
        </Row>

        <Modal
          show={this.state.showAddMovieModal}
          onHide={this.handleAddMovieModalToggle}
        >
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

        <ModalNotification
          title="Movie Added"
          ref={this.movieAddedNotification}
        />
      </Container>
    );
  }
}

export default MovieList;

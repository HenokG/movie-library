import React, { Component } from "react";
import "./Movie.css";
import Card from "react-bootstrap/Card";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import ListGroup from "react-bootstrap/ListGroup";
import StarRatingComponent from "react-star-rating-component";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import customAxios from "../utils/custom-axios";
import { withRouter } from "react-router-dom";
import to from "../utils/to";
import ModalNotification from "../partials/ModalNotification";
import MovieModal from "./MovieModal";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";

/**
 * Movie component to render a single movie
 *
 * @class Movie
 * @extends {Component}
 */
class Movie extends Component {
  /**
   *Creates an instance of Movie.
   * @memberof Movie
   */
  constructor() {
    super();

    this.movieModal = React.createRef();

    this.modalShareNotification = React.createRef();
    this.modalRateNotification = React.createRef();

    this.handleRatingModalToggle = this.handleRatingModalToggle.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmitRating = this.handleSubmitRating.bind(this);
    this.handleShare = this.handleShare.bind(this);

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);

    this.state = {
      showRatingModal: false,
      error: null
    };
  }

  /**
   * toggle movie rating modal
   *
   * @memberof Movie
   */
  handleRatingModalToggle() {
    this.setState({ showRatingModal: !this.state.showRatingModal });
  }

  handleCommentChange(event) {
    this.setState({ comment: event.target.value });
  }

  handleStarRatingChange(nextValue) {
    this.setState({ rate: nextValue });
  }

  /**
   * called when user clicks edit for a movie
   * which sets the title of the modal to
   * edit + movieTitle and opens the
   * edit modal
   *
   * @memberof Movie
   */
  handleEditClick() {
    this.movieModal.current.setTitle({
      title: `Edit ${this.props.movie.title}`
    });
    this.movieModal.current.openEditModal(this.props.movie._id);
  }

  /**
   * used to handle deletion of a movie
   *
   * sets title to delete + movieTitle ?
   * then opens confirmation modal
   *
   * @memberof Movie
   */
  handleDeleteClick() {
    this.movieModal.current.setTitle({
      title: `Delete ${this.props.movie.title} ?`
    });
    this.movieModal.current.openDeleteModal(this.props.movie._id);
  }

  /**
   * asynchronously submit user review
   * including comment
   *
   * if server response if OK
   * show notification
   *
   * @memberof Movie
   */
  async handleSubmitRating() {
    const [error, response] = await to(
      customAxios.post(`/movies/rate`, {
        id: this.props.movie._id,
        rating: this.state.rate,
        comment: this.state.comment
      })
    );

    if (error) return this.setState({ error: "invalid operation" });

    this.setState({ showRatingModal: false });

    if (response.status === 200)
      this.modalRateNotification.current.handleNotificationToggle();
  }

  /**
   * asynchronously submit user share request
   * and show notification if response
   * from server is ok
   *
   * @memberof Movie
   */
  async handleShare() {
    const [error, response] = await to(
      customAxios.post(`/movies/share`, {
        id: this.props.movie._id
      })
    );

    if (error) return this.setState({ error: "invalid operation" });

    if (response.status === 200)
      this.modalShareNotification.current.handleNotificationToggle();
  }

  render() {
    // release date shall be formatted to human readable date
    const releaseDateFormatted = this.props.movie.releaseDate
      ? new Date(this.props.movie.releaseDate).toDateString()
      : "N/A";
    return (
      <div className="ml-5 mt-3">
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title className="font-weight-bold">
              {this.props.movie.title}
            </Card.Title>
            <Card.Text>Staring: {this.props.movie.actors}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Release Date: {releaseDateFormatted}</ListGroupItem>
            <ListGroupItem>
              Duration: {this.props.movie.duration} hrs
            </ListGroupItem>
            <ListGroupItem>
              Average Rating:
              <Badge className="badge-info ml-2">
                {this.props.movie.averageRating}/5
              </Badge>
            </ListGroupItem>
          </ListGroup>
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted" />
            <Card.Subtitle className="mb-2 text-muted" />
            <ButtonGroup
              className="d-flex justify-content-center"
              aria-label="First group"
            >
              <Button
                className="btn-sm"
                disabled={this.props.movie.previouslyRated}
                onClick={this.handleRatingModalToggle}
              >
                Rate
              </Button>
              <Button className="btn-sm" onClick={this.handleShare}>
                Share
              </Button>
              <Button className="btn-sm" onClick={this.handleEditClick}>
                Edit
              </Button>
              <Button className="btn-sm" onClick={this.handleDeleteClick}>
                Delete
              </Button>
            </ButtonGroup>

            {/* user reviews */}

            <Accordion className="mt-4">
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Reviews
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  {this.props.movie.reviews &&
                    this.props.movie.reviews.map(review => {
                      return (
                        <>
                          <p className="font-weight-bold">@{review.username}</p>
                          <StarRatingComponent
                            name="r"
                            value={review.rating}
                            editing={false}
                          />
                          <p>{review.comment}</p>
                          <hr />
                        </>
                      );
                    })}
                </Card.Body>
              </Accordion.Collapse>
            </Accordion>
          </Card.Body>
        </Card>

        {/* modals */}

        <Modal
          show={this.state.showRatingModal}
          onHide={this.handleRatingModalToggle}
        >
          <Modal.Header closeButton>
            <Modal.Title>Rate {this.props.movie.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StarRatingComponent
              className="star-rating"
              name="rate"
              onStarClick={this.handleStarRatingChange.bind(this)}
              starCount={5}
            />
            <Form.Control
              type="text"
              name="comment"
              onChange={this.handleCommentChange}
              placeholder="Comment here..."
            />

            <div className="text-danger mb-2">{this.state.error}</div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="primary" onClick={this.handleSubmitRating}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* <MovieModal ref={this.movieModal} movie={{}} /> */}
        <MovieModal ref={this.movieModal} movie={this.props.movie} />

        <ModalNotification title="Shared" ref={this.modalShareNotification} />
        <ModalNotification title="Rated" ref={this.modalRateNotification} />
      </div>
    );
  }
}

export default withRouter(Movie);

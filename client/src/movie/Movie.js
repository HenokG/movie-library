import React, { Component } from "react";
import "./Movie.css";
import Card from "react-bootstrap/Card";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import ListGroup from "react-bootstrap/ListGroup";
import StarRatingComponent from "react-star-rating-component";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";
import ModalNotification from "../partials/ModalNotification";
import Badge from "react-bootstrap/Badge";

export class Movie extends Component {
  constructor() {
    super();

    this.modalNotification = React.createRef();
    this.modalRateNotification = React.createRef();

    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmitRating = this.handleSubmitRating.bind(this);
    this.handleShare = this.handleShare.bind(this);

    this.state = {
      showRatingModal: false,
      error: null
    };
  }

  handleModalToggle() {
    this.setState({ showRatingModal: !this.state.showRatingModal });
  }

  handleCommentChange(event) {
    this.setState({ comment: event.target.value });
  }

  handleStarRatingChange(nextValue) {
    this.setState({ rate: nextValue });
  }

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

  async handleShare() {
    const [error, response] = await to(
      customAxios.post(`/movies/share`, {
        id: this.props.movie._id
      })
    );

    if (error) return this.setState({ error: "invalid operation" });

    if (response.status === 200) {
      this.modalNotification.current.handleNotificationToggle();
      this.props.history.push("/shared");
    }
  }

  render() {
    const rateButtonClass = this.props.movie.previouslyRated ? "disabled" : "";

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
            <ListGroupItem>
              {`Release Date: ${this.props.movie.releaseDate}`}
            </ListGroupItem>
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
            <Card.Link
              href="#"
              className={`btn btn-primary ${rateButtonClass}`}
              onClick={this.handleModalToggle}
            >
              Rate
            </Card.Link>
            <Card.Link
              href="#"
              className="btn btn-primary"
              onClick={this.handleShare}
            >
              Share
            </Card.Link>
          </Card.Body>
        </Card>

        <Modal
          show={this.state.showRatingModal}
          onHide={this.handleModalToggle}
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

        <ModalNotification title="Shared" ref={this.modalNotification} />
        <ModalNotification title="Rated" ref={this.modalRateNotification} />
      </div>
    );
  }
}

export default Movie;

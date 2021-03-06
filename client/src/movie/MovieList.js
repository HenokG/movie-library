import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Movie from "./Movie";
import MovieModal from "./MovieModal";

/**
 * MovieList component for rendering a list of movies
 *
 * @class MovieList
 * @extends {Component}
 */
class MovieList extends Component {
  /**
   *Creates an instance of MovieList.
   * @memberof MovieList
   */
  constructor() {
    super();

    this.movieModal = React.createRef();

    this.handleSort = this.handleSort.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddMovie = this.handleAddMovie.bind(this);

    this.state = {
      showMovieModal: false,
      movies: [],
      error: null
    };
  }

  /**
   * handle sorting after state is ready
   *
   * @param {*} nextProps
   * @memberof MovieList
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.movies !== this.props.movies) {
      this.setState({ movies: nextProps.movies }, () => {
        this.handleSort();
      });
    }
  }

  updateMovies({ movies }) {
    this.setState({ movies: movies });
  }

  /**
   * open add movie modal after setting
   * modal title to 'add a movie'
   *
   * @memberof MovieList
   */
  handleAddMovie() {
    this.movieModal.current.setTitle({ title: "Add a Movie" });
    this.movieModal.current.openAddModal();
  }

  /**
   * sort movieslist with user
   *
   * @param {*} event
   * @memberof MovieList
   */
  handleSort(event) {
    /**
     * get sorting index either from user event or
     * previously saved index from localStorage
     */
    const index = event ? event.target.value : localStorage.getItem("sort");
    const sortByTitleA = (a, b) => (a.title < b.title ? -1 : 1);
    const sortByTitleD = (a, b) => (a.title < b.title ? 1 : -1);
    const sortByDurationA = (a, b) => (a.duration < b.duration ? -1 : 1);
    const sortByDurationD = (a, b) => (a.duration < b.duration ? 1 : -1);

    const sort = index => {
      if (index == 0) {
        this.setState({
          movies: this.state.movies.sort(sortByTitleA)
        });
      } else if (index == 1) {
        this.setState({
          movies: this.state.movies.sort(sortByTitleD)
        });
      } else if (index == 2) {
        this.setState({
          movies: this.state.movies.sort(sortByDurationA)
        });
      } else if (index == 3) {
        this.setState({
          movies: this.state.movies.sort(sortByDurationD)
        });
      }
    };
    sort(index);
    // save sorting index so users can get the same sorting when accessing the page again
    localStorage.setItem("sort", index);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <Container>
        <h1 className="mt-3 text-center">{this.props.title}</h1>

        <Row className="text-center">
          <Form className="form-inline">
            <Form.Group controlId="selectSort">
              <Form.Label className="mx-3 mt-3">Sort By</Form.Label>
              <Form.Control
                as="select"
                className="custom-select max-content mt-3"
                onChange={this.handleSort}
              >
                <option>Click here...</option>
                <option value={0}>Title Ascending</option>
                <option value={1}>Title Descending</option>
                <option value={2}>Duration Ascending</option>
                <option value={3}>Duration Descending</option>
              </Form.Control>
              <Button
                className="ml-3 mt-3"
                variant="primary"
                onClick={this.handleAddMovie}
              >
                Add a Movie
              </Button>
            </Form.Group>
          </Form>
        </Row>

        <Row className="mt-3">
          {this.state.movies.length > 0 &&
            this.state.movies.map(movie => <Movie movie={movie} />)}
        </Row>

        <MovieModal ref={this.movieModal} movie={{}} />
      </Container>
    );
  }
}

export default MovieList;

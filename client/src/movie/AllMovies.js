import React, { Component } from "react";
import App from "../App";
import MovieList from "./MovieList";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";

/**
 * AllMovies component for displaying all movies in database
 * using the <MovieList /> component
 *
 * @class AllMovies
 * @extends {Component}
 */
class AllMovies extends Component {
  /**
   *Creates an instance of AllMovies.
   * @memberof AllMovies
   */
  constructor() {
    super();

    this.loadMovies = this.loadMovies.bind(this);

    this.state = {
      movies: []
    };
  }

  /**
   * when component mounts, if all movies haven't been
   * loaded before load them
   *
   * @memberof AllMovies
   */
  componentDidMount() {
    if (this.state.movies.length === 0) this.loadMovies();
  }

  /**
   * load all movies from server
   *
   * @memberof AllMovies
   */
  async loadMovies() {
    const [error, response] = await to(customAxios.get("/movies"));
    if (error) return;

    if (response.status === 200) this.setState({ movies: response.data });
  }

  render() {
    return (
      <App>
        <MovieList title="All Movies" movies={this.state.movies} />
      </App>
    );
  }
}

export default AllMovies;

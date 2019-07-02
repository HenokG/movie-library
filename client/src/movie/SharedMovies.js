import React, { Component } from "react";
import App from "../App";
import MovieList from "./MovieList";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";

/**
 * SharedMovies component for rendering shared movies using
 * the <MovieList /> component
 *
 * @class SharedMovies
 * @extends {Component}
 */
class SharedMovies extends Component {
  /**
   * Creates an instance of SharedMovies.
   * @memberof SharedMovies
   */
  constructor() {
    super();

    this.loadMovies = this.loadMovies.bind(this);

    this.state = {
      movies: []
    };
  }

  /**
   * load movies from server when
   * component mounts
   *
   * @memberof SharedMovies
   */
  componentDidMount() {
    if (this.state.movies.length === 0) this.loadMovies();
  }

  /**
   * asynchronously load movies from server
   *
   * @returns
   * @memberof SharedMovies
   */
  async loadMovies() {
    const [error, response] = await to(customAxios.get("/movies/shared"));
    if (error) return;

    if (response.status === 200) this.setState({ movies: response.data });
  }
  render() {
    return (
      <App>
        <MovieList title="Shared Movies" movies={this.state.movies} />
      </App>
    );
  }
}

export default SharedMovies;

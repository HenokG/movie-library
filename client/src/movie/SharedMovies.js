import React, { Component } from "react";
import Layout from "../partials/Layout";
import MovieList from "./MovieList";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";

class SharedMovies extends Component {
  constructor() {
    super();

    this.loadMovies = this.loadMovies.bind(this);

    this.state = {
      movies: []
    };
  }

  componentDidMount() {
    if (this.state.movies.length === 0) this.loadMovies();
  }

  async loadMovies() {
    const [error, response] = await to(customAxios.get("/movies/shared"));
    if (error) {
      return;
    }
    if (response.status === 200) {
      this.setState({ movies: response.data });
    }
  }
  render() {
    return (
      <Layout>
        <MovieList title="Shared Movies" movies={this.state.movies} />
      </Layout>
    );
  }
}

export default SharedMovies;

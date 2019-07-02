import React, { Component } from "react";
import App from "../App";
import MovieList from "./MovieList";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";
import socketIOClient from "socket.io-client";
import Config from "../utils/config";
import Alert from "react-bootstrap/Alert";

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

    this.handlePushNotificationToggle = this.handlePushNotificationToggle.bind(
      this
    );

    this.loadMovies = this.loadMovies.bind(this);

    this.state = {
      movies: [],
      showPushNotification: false
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
    this.hookUpSocketConnection();
  }

  /**
   * toggle push notification
   *
   * @memberof SharedMovies
   */
  handlePushNotificationToggle() {
    this.setState({ showPushNotification: !this.state.showPushNotification });
  }

  /**
   * hook up socket connection to the api server
   * and listen for update on all movies
   *
   * @memberof AllMovies
   */
  hookUpSocketConnection() {
    const socket = socketIOClient(Config.BASE_URL);
    socket.on("fromAPIUpdateAllMovies", data => {
      this.setState({
        movies: data.data,
        notificationMessage: data.message,
        showPushNotification: true
      });
    });
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
        <Alert
          variant="info"
          className="mt-3"
          show={this.state.showPushNotification}
          dismissible
          onClose={this.handlePushNotificationToggle}
        >
          <strong class="pr-5">notification</strong>
          {this.state.notificationMessage}
        </Alert>

        <MovieList title="All Movies" movies={this.state.movies} />
      </App>
    );
  }
}

export default AllMovies;

import React, { Component } from "react";
import App from "../App";
import MovieList from "./MovieList";
import customAxios from "../utils/custom-axios";
import to from "../utils/to";
import socketIOClient from "socket.io-client";
import Config from "../utils/config";
import Alert from "react-bootstrap/Alert";

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
   * load movies from server when
   * component mounts
   *
   *
   * @memberof SharedMovies
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
   * and listen for update on shared movies
   *
   * @memberof SharedMovies
   */
  hookUpSocketConnection() {
    const socket = socketIOClient(Config.BASE_URL);
    socket.on("fromAPIUpdateSharedMovies", data => {
      this.setState({
        movies: data.data,
        notificationMessage: data.message,
        showPushNotification: true
      });
    });
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
        <Alert
          variant="info"
          className="mt-3 text-center"
          show={this.state.showPushNotification}
          dismissible
          onClose={this.handlePushNotificationToggle}
        >
          <strong className="pr-5">notification </strong>
          {this.state.notificationMessage}
        </Alert>

        <MovieList title="Shared Movies" movies={this.state.movies} />
      </App>
    );
  }
}

export default SharedMovies;

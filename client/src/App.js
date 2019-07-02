import React, { Component } from "react";
import Header from "./partials/Header";

/**
 * App component
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  render() {
    return (
      <>
        <Header />
        {this.props.children}
      </>
    );
  }
}

export default App;

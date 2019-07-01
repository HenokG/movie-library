import React, { Component } from "react";
import "./App.css";
import Login from "./authentication/LogIn";
import Layout from "./partials/Layout";

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Layout>
        <Login />
      </Layout>
    );
  }
}

export default App;

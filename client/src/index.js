import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import LogIn from "./authentication/LogIn";
import SignUp from "./authentication/SignUp";
import Auth from "./authentication/Auth";
import AllMovies from "./movie/AllMovies";
import SharedMovies from "./movie/SharedMovies";
import * as serviceWorker from "./serviceWorker";
import {
  Route,
  Redirect,
  Switch,
  BrowserRouter as Router
} from "react-router-dom";

/**
 * Custom component which provides easy route definition for private/protected
 * routes(ex. /shared).
 *
 * Every property/attribute is passed down to Route if authenticated, if not
 * then redirect to /login.
 *
 * this component allows us to not have a wrapper component which gets rendered
 * every time so we can protect our routes, it simply allowws us to have a
 * private route component
 *
 * @param {*} { component: Component, ...rest }
 */

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const routing = (
  <Router>
    <>
      <Switch>
        <PrivateRoute exact path="/" component={AllMovies} />
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
        <PrivateRoute path="/all" component={AllMovies} />
        <PrivateRoute path="/shared" component={SharedMovies} />
        <Route component={LogIn} />
      </Switch>
    </>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

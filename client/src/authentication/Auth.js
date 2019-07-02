/**
 * helper class for authentication
 *
 * @class Auth
 */
class Auth {
  /**
   * check if user is authenticated using
   * localstorage key = 'loggedInUser'
   *
   * @static
   * @returns {object} which contains the user token and username properties or false if not authenticated
   * @memberof Auth
   */
  static isAuthenticated() {
    return localStorage.getItem("loggedInUser") || false;
  }

  /**
   * retrieve authentication token from localstorage
   * if user is authenticated
   *
   * @static
   * @returns {string} token which is used for priviledged access
   * @memberof Auth
   */
  static getToken() {
    if (this.isAuthenticated())
      return JSON.parse(localStorage.getItem("loggedInUser")).token;
  }
}

export default Auth;

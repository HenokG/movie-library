export class Auth {
  static isAuthenticated() {
    return localStorage.getItem("loggedInUser") || false;
  }

  static getToken() {
    if (this.isAuthenticated())
      return JSON.parse(localStorage.getItem("loggedInUser")).token;
  }
}

export default Auth;

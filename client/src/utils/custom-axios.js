import axios from "axios";
import Config from "./config";
import Auth from "../authentication/Auth";

/**
 * define custom axios that defines the base url
 * and adds token header to every request sent
 * to server for authentication
 */

// add base url
const customAxios = axios.create({
  baseURL: Config.API_URL
});

// add token header to every request
customAxios.interceptors.request.use(
  function(config) {
    config.headers["token"] = Auth.getToken();
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default customAxios;

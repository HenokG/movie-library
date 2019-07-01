import axios from "axios";
import Config from "./config";
import Auth from "../authentication/Auth";

const customAxios = axios.create({
  baseURL: Config.API_URL
});

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

import axios from "axios";
import env from "../environments";

const platformAPIClient = axios.create({
  baseURL: "https://api.minepi.com",
  timeout: 20000,
});

export default platformAPIClient;

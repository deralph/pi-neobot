import axios from "axios";
import env from "../environments";

const platformAPIClient = axios.create({
  baseURL: "https://api.minepi.com",
  timeout: 20000,
  // headers: {
  //   'Authorization': `Key keftdljlayea9c12rjumna24ptsewomoo8mb1vonnzexpo8lcgkxjlxbrunyfmmk`,
  // },
});

export default platformAPIClient;

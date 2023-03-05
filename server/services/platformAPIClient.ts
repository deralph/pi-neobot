import axios from "axios";
import env from "../environments";

const platformAPIClient = axios.create({
  baseURL: "https://api.minepi.com",
  timeout: 20000,
  headers: {
    Authorization: `Key b178091720052cebb06211ae8fb9bcacc6d654789d640540ef1a0ae5b799c0b53732afd541f7a7b6a1446eeb5843bfafbf0c7d81807d12c13f367afb5c1d039a`,
  },
});

export default platformAPIClient;

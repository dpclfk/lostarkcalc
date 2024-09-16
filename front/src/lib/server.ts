import axios from "axios";

const serverbase = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

export default serverbase;

import axios from "axios";

const serverbase = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

export default serverbase;

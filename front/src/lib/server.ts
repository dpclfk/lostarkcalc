import axios from "axios";

const serverbase = axios.create({
  baseURL: "http://localhost:3080/api/",
  withCredentials: true,
});

export default serverbase;

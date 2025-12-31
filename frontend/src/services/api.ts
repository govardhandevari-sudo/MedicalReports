
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("REACT_APP_API_BASE_URL is not defined");
}

export const api = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/api`,
  timeout: 15000,
 // withCredentials: true
});

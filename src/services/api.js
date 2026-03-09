import axios from "axios";

const API = axios.create({
 baseURL: "http://localhost:8080/api"
});

export const StudentRegister = (data) =>
 API.post("/auth/register", data);

export const StudentLogin = (data) =>
 API.post("/auth/login", data);

export const OtpVerification = (data) =>
 API.post("/otp/verify", data);

export default API;
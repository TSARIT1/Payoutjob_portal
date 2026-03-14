import axios from "axios";

const API = axios.create({
 baseURL: "http://localhost:8080/api"
});

export const StudentRegister = (data) =>
 API.post("/auth/register", data);

// Compatibility aliases used by auth pages.
export const registerStudent = StudentRegister;

export const StudentLogin = (data) =>
 API.post("/auth/login", data);

export const loginStudent = StudentLogin;

export const OtpVerification = (data) =>
 API.post("/otp/verify", data);

export const verifyOtp = OtpVerification;

export default API;
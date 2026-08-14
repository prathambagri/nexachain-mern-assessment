import axiosClient from "./axiosClient";

export const registerUser = (payload) => axiosClient.post("/auth/register", payload);
export const loginUser = (payload) => axiosClient.post("/auth/login", payload);

export const createInvestment = (payload) => axiosClient.post("/investments", payload);
export const getUserInvestments = () => axiosClient.get("/investments");

export const getDashboard = () => axiosClient.get("/dashboard");

export const getDirectReferrals = () => axiosClient.get("/referrals/direct");
export const getReferralTree = () => axiosClient.get("/referrals/tree");

export const getROIHistory = () => axiosClient.get("/roi-history");
export const getReferralIncomeHistory = () => axiosClient.get("/referral-income");

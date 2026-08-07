import axiosInstance from "./axiosInstance";


export const getAnalytics = () => axiosInstance.get("/analytics");
export const getPublicStats = () => axiosInstance.get("/analytics/public");
export const trackVisit = () => axiosInstance.post("/analytics/visit");
export const trackResumeDownload = () => axiosInstance.post("/analytics/resume-download");

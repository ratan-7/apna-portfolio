import axiosInstance from "./axiosInstance";

export const getSocialLinks = () => axiosInstance.get("/social");
export const updateSocialLinks = (data) => axiosInstance.put("/social", data);

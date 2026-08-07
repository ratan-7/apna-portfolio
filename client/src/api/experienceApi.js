import axiosInstance from "./axiosInstance";

export const getExperience = () => axiosInstance.get("/experiences");
export const createExperience = (data) => axiosInstance.post("/experiences", data);
export const updateExperience = (id, data) => axiosInstance.patch(`/experiences/${id}`, data);
export const deleteExperience = (id) => axiosInstance.delete(`/experiences/${id}`);

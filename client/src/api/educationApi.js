import axiosInstance from "./axiosInstance";

export const getEducation = () => axiosInstance.get("/educations");
export const createEducation = (data) => axiosInstance.post("/educations", data);
export const updateEducation = (id, data) => axiosInstance.patch(`/educations/${id}`, data);
export const deleteEducation = (id) => axiosInstance.delete(`/educations/${id}`);

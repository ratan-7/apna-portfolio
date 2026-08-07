import axiosInstance from "./axiosInstance";

export const getSkills = () => axiosInstance.get("/skills");
export const createSkill = (data) => axiosInstance.post("/skills", data);
export const updateSkill = (id, data) => axiosInstance.patch(`/skills/${id}`, data);
export const deleteSkill = (id) => axiosInstance.delete(`/skills/${id}`);

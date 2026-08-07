import axiosInstance from "./axiosInstance";

export const submitContact = (data) => axiosInstance.post("/contacts", data);

export const getContacts = () => axiosInstance.get("/contacts");
export const markContactRead = (id) => axiosInstance.patch(`/contacts/${id}`, { isRead: true });
export const deleteContact = (id) => axiosInstance.delete(`/contacts/${id}`);

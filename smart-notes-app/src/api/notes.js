import axios from "axios";

const BASE_URL = "http://localhost:5000/api/notes";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchNotes = () =>
  axios.get(BASE_URL, getAuthHeaders()).then((res) => res.data);

export const deleteNote = (id) =>
  axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());

export const createNote = (note) =>
  axios.post(BASE_URL, note, getAuthHeaders());

export const updateNote = (id, note) =>
  axios.put(`${BASE_URL}/${id}`, note, getAuthHeaders());

export const togglePinNote = (id, pinned) =>
  axios.put(`${BASE_URL}/${id}`, { pinned }, getAuthHeaders());
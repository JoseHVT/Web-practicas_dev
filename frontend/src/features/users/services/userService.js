import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

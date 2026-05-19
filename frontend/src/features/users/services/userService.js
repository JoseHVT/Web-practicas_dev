import axios from 'axios';
import { getAuthToken } from '../../../shared/utils/authSession';

const API_URL = 'http://localhost:3000/users';

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`
  }
});

export const getUsers = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData, getAuthConfig());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};

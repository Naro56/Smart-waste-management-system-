import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.method, request.url);
  return request;
});

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.log('Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Regular user login
const loginUser = async (credentials) => {
  try {
    console.log('Attempting login with:', credentials);
    axios.post('http://localhost:5000/api/auth/login', {
      email: 'msrprasad477@gmail.com',
      password: '123456'
    }, {
      withCredentials: true // Allow cookies
    })
    .then(response => console.log(response))
    .catch(error => console.error(error));
    
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// Admin login
const loginAdmin = async (credentials) => {
  try {
    console.log('Attempting admin login with:', credentials);
    const response = await axios.post(`${API_URL}/login`, {
      ...credentials,
      role: 'admin'
    }, {
      withCredentials: true // Allow cookies
    });
    return response.data;
  } catch (error) {
    console.error('Admin login failed:', error.response?.data || error.message);
    throw error;
  }
};

// User registration
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// Export all functions
export { loginUser, loginAdmin, register };
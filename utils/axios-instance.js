import axios from 'axios';
import Router from 'next/router';
import { getLogger } from '@/utils/logger/logger';

const logger = getLogger('axiosInstance');
const axiosInstance = axios.create();

// Add a request interceptor to attach tokens for client-side requests
axiosInstance.interceptors.request.use(
  (config) => {
      if (typeof window !== 'undefined') {
          // If client-side, get the token from sessionStorage
          const token = window.sessionStorage.getItem('accessToken');
          if (token) {
              config.headers.Authorization = `Bearer ${token}`; // Attach the token to the request
              logger.debug(`axiosInstance - Attached token to request: ${token}`);
          }
      }
      return config; // Return the config with token attached
  },
  (error) => {
      // Handle request errors
      logger.error(`axiosInstance - Request error: ${error.message}`);
      return Promise.reject(error); // Reject the request with the error
  }
);

// Add a response interceptor to handle 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if it's successful
  async (error) => {
      const originalRequest = error.config;
      
      // Handle 401: Unauthorized and refresh token logic
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark the request as retryable to avoid loops
          
          try {
              // Use base axios to call the refresh token endpoint to avoid interceptor recursion
              const { data } = await axios.post('/api/users/refresh-token');
              logger.debug(`New access token retrieved: ${data.token}`);
              
              // Store new token in sessionStorage
              if (typeof window !== 'undefined') {
                  window.sessionStorage.setItem('accessToken', data.token);
              }
              
              // Set the new token in the request headers and retry
              originalRequest.headers.Authorization = `Bearer ${data.token}`;
              
              // Retry the original request with the new token
              return axiosInstance(originalRequest);
          } catch (refreshError) {
              logger.error(`Refresh token retrieval failed: ${refreshError}`);
              
              // Redirect to sign-in page if refresh fails
              if (typeof window !== 'undefined') {
                  Router.push('/auth/signin'); // Use Next.js router for client-side navigation
                  
                  // Use this if you want to force a full page reload
                  // window.location.href = '/auth/signin';
              }
          }
      }
      
      return Promise.reject(error); // Reject if it's not handled
  }
);


export default axiosInstance;

// client/src/services/api.js

import axios from 'axios';
import mockApi from './mockApiService';

// Determină dacă folosim API-ul simulat sau real
const useRealApi = process.env.REACT_APP_USE_REAL_API === 'true';

// Helper pentru a extrage parametrii din string query
const parseQueryParams = (url) => {
  const queryString = url.split('?')[1];
  if (!queryString) return {};
  
  const params = {};
  const pairs = queryString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  
  return params;
};

// Interceptor pentru a redirecționa cereri către API-ul simulat când e necesar
axios.interceptors.request.use(
  async (config) => {
    // Permite bypass-ul interceptorului când e necesar
    if (config.bypassMockApi) {
      return config;
    }
    
    // Folosim API-ul real sau mock în funcție de configurație
    if (!useRealApi) {
      const url = config.url;
      
      // Extrage calea API și parametrii
      const apiPath = url.replace(`${process.env.REACT_APP_API_URL}`, '');
      const params = parseQueryParams(url);
      
      // Anulează cererea Axios originală
      config.cancelToken = new axios.CancelToken((cancel) => cancel('Request handled by mock API'));
      
      // Procesează cererea folosind API-ul simulat
      try {
        let response;
        
        // Redirecționează către serviciile API simulate corespunzătoare
        if (apiPath.startsWith('/cars')) {
          if (apiPath === '/cars/brands') {
            response = await mockApi.cars.getBrands();
          } else if (apiPath.match(/\/cars\/\d+/)) {
            const id = apiPath.split('/')[2];
            response = await mockApi.cars.getCarById(id);
          } else {
            response = await mockApi.cars.getCars(params);
          }
        } else if (apiPath.startsWith('/auth')) {
          if (apiPath === '/auth/login') {
            response = await mockApi.auth.login(config.data);
          } else if (apiPath === '/auth/validate') {
            response = await mockApi.auth.validateToken();
          }
        }
        
        // Setează răspunsul simulat
        config.adapter = () => {
          return Promise.resolve({
            data: response,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
          });
        };
      } catch (error) {
        // Gestionează erori din API-ul simulat
        config.adapter = () => {
          return Promise.reject({
            response: {
              data: { error: error.message },
              status: 400,
              statusText: 'Error',
              headers: {},
              config,
              request: {}
            }
          });
        };
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
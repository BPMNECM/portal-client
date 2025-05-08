import axios from 'axios';
import { getLogger } from '@/utils/logger/logger';

const buildClient = (param = {}) => {
    const logger = getLogger('build-client');
    const { req } = param; // Destructure safely with default empty object
    
    if (typeof window === 'undefined') {
        // Server-side requests - use the base URL with headers from the SSR request
        logger.debug(`Server-side requests with baseURL: ${process.env.NEXT_PUBLIC_BASE_URL}, headers: ${JSON.stringify(req?.headers)} `);
        
        return axios.create({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            // headers: req.headers // Pass the request headers (important for SSR)
            headers: req ? req.headers : {} // Ensure req is defined
        });
    } else {
        // Client-side requests - use relative URL
        logger.debug(`Client-side requests using relative path: '/'`);
        
        const token = window.sessionStorage.getItem('accessToken');
        logger.debug(`Client-side token: ${token}`);
        
        return axios.create({
            baseURL: '/',
            headers: {
                Authorization: token ? `Bearer ${token}` : '' // Attach the token if available
            }
        });
    }
};

export default buildClient;

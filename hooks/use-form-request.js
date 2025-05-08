import { useState } from 'react';
import { getLogger } from '@/utils/logger/logger';
import axiosInstance from '@/utils/axios-instance';

const logger = getLogger('useFormRequest');

const useFormRequest = () => {
    const [errors, setErrors] = useState(null);
    let errorData;
    
    const doRequest = async ({ url, method, body, onSuccess, onError }) => {
        try {
            logger.debug(`useFormRequest - Axios function called for the URL ${url}`);
            setErrors(null);
            
            // Make the API request
            const response = await axiosInstance[method](url, { ...body });
            
            // Handle the success case
            if (onSuccess) {
                onSuccess(response.data);
            }
            
            logger.debug(`useFormRequest - Response Data: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (err) {
            logger.error(`useFormRequest - Error while calling the API: ${err}`);
            
            if (err.response && err.response.status >= 400 && err.response.status < 500) {
                errorData = {
                    message: 'Oops! Something went wrong with the Form request..',
                    errors: err.response.data.errors || [err.response.data.message]
                };
            } else {
                errorData = {
                    message: 'Oops!!! Something went wrong with the Form request..',
                    errors: [err.message]
                };
            }
            setErrors(errorData);
            
            if (onError) {
                onError(errorData);
            }
            
            return errorData;
        }
    };
    
    return { doRequest, errors };
};

export default useFormRequest;
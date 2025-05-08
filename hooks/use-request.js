import {useState} from 'react';
import {getLogger} from '@/utils/logger/logger';
import axiosInstance from '@/utils/axios-instance';
import * as cheerio from 'cheerio'; // Helps parse HTML errors

const logger = getLogger('useRequest');

const useRequest = ({url, method, body, onSuccess}) => {
	const [errors, setErrors] = useState(null);
	
	// Function to extract meaningful error message from HTML responses
	const extractErrorMessage = (htmlResponse) => {
		try {
			const $ = cheerio.load(htmlResponse);
			return $('pre').text() || 'An unknown error occurred.';
		} catch (err) {
			return 'Failed to parse error message.';
		}
	};
	
	const doRequest = async (props = {}) => {
		try {
			setErrors(null);
			const response = await axiosInstance[method](url, {...body, ...props});
			logger.info(`✅ useRequest - Success: ${method.toUpperCase()} ${url}`);
			
			// ✅ **Handle API errors returned inside the response**
			if (response.data?.status === 'error') {
				throw new Error(`${response.data.message} - ${response.data.details || 'No additional details'}`);
			}
			
			if (onSuccess) onSuccess(response.data);
			
			logger.info(`📄 Response Data: ${JSON.stringify(response.data)}`);
			return response.data;
		} catch (err) {
			let statusCode = err.response?.status || 'Unknown';
			let errorMsg = err?.response?.data?.message || err.message || 'Unknown error occurred!';
			let details = '';
			
			// ✅ **Extract and normalize error details**
			if (err.response?.data?.details) {
				try {
					details = typeof err.response.data.details === 'string'
						? JSON.parse(err.response.data.details).details
						: err.response.data.details;
				} catch (parseError) {
					details = err.response.data.details;  // Fallback if parsing fails
				}
			}
			
			errorMsg = `${errorMsg} - ${details || 'No additional details'}`;
			
			const formattedError = {status: statusCode, message: errorMsg};
			
			logger.error(`❌ useRequest - Error: ${method.toUpperCase()} ${url} - Status ${statusCode} - ${errorMsg}`);
			
			setErrors({
				message: 'Oops! Something went wrong with the API request.',
				errors: [errorMsg]
			});
			
			throw formattedError;
		}
	};
	
	
	return {doRequest, errors};
};

export default useRequest;

import {getLogger} from '@/utils/logger/logger';

const logger = getLogger('CommonUtils');

export const handleError = (error) => {
	if (error.response) {
		// The request was made, but the server responded with a status code that falls outside the range of 2xx
		return `Server responded with status ${error.response.status}: ${error.response.data?.message || JSON.stringify(error.response.data)}`;
	} else if (error.request) {
		// The request was made, but no response was received
		return `No response received: ${JSON.stringify(error.request)}`;
	} else {
		// Something happened in setting up the request that triggered an Error
		return `Error: ${error.message}`;
	}
};

export const checkAuth = (currentUser) => {
	logger.trace('Inside checkAuth function...');
	return currentUser && currentUser.name !== undefined;
};

export function classNames(...classes) {
	logger.trace('Inside classNames function...');
	return classes.filter(Boolean).join(' ');
}

export const overrideClasses = 'block mx-auto border-t-4 border-red-500';

function clean(input) {
	logger.trace('Inside clean string function...');
	
	const str = input + '';
	
	if (str === '') return 0;
	
	const replaced = str.replace(/[^0-9.-]/g, '');
	if (replaced === '-') return 0;
	else return parseFloat(replaced);
}

const onBlur = (site) => {
	logger.trace('Inside onBlur function - only for Floats');
	
	const value = parseFloat(site);
	if (isNaN(value)) {
		return;
	}
	// setSite(value.toFixed(2));
};

export const getInitials = (name) => {
	if (!name) return '';
	
	const nameParts = name.split(' ');
	
	if (nameParts.length === 1) {
		return nameParts[0].charAt(0);
	} else if (nameParts.length === 2) {
		return nameParts[0].charAt(0) + nameParts[1].charAt(0);
	} else {
		return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
	}
};

export function mapOptionValueToText(options, value) {
	logger.trace('Inside mapOptionValueToText function...');
	
	if (!Array.isArray(options)) {
		logger.error('mapOptionValueToText - Options should be an array!');
		return value;
	}
	
	const selectedOption = options.find((option) => option.value === value);
	return selectedOption ? selectedOption.label : value;
}

export const mapLabelToValue = (label, options) => {
	if (label === null || label === undefined || label === '') {
		return 'U';
	}
	const option = options.find((option) => option.label === label);
	return option ? option.value : 'U';
};

export const getUpdatedValue = (newValue, currentValue) => (newValue !== '' ? newValue : currentValue);

export const farActions = [
	{
		title: 'Source resources',
		side: 'source'
	},
	{
		title: 'FAR resources',
		side: 'far'
	}
];

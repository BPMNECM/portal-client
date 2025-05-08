import { useEffect, useState } from 'react';
import { getLogger } from '@/utils/logger/logger';

const logger = getLogger('useStore:');

const useStore = (store, callback) => {
    const result = store(callback);
    const [data, setData] = useState();
    logger.debug(`useStore - custom hook...`);
    
    useEffect(() => {
        setData(result);
    }, [result]);
    
    return data;
};

export default useStore;

/*
 This hook waits until the component has mounted on the client side before updating the state.
 This helps to avoid the hydration issues you mentioned, such as text content mismatches or hydration failures.
 */
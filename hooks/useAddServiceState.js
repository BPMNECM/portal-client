// This Hook is for Managing Add Service button State
import { useEffect, useState } from 'react';

const useAddServiceState = (service, isCardService, isPortService) => {
    const [isAddServiceEnabled, setIsAddServiceEnabled] = useState(true);
    
    const checkAddServiceButtonState = () => {
        if (service.card !== 'Empty Slot') {
            if (isCardService && service.chassis && service.slot) {
                setIsAddServiceEnabled(true);
            } else if (isPortService && service.chassis && service.slot && service.port) {
                setIsAddServiceEnabled(true);
            } else {
                setIsAddServiceEnabled(false);
            }
        } else {
            setIsAddServiceEnabled(false);
        }
    };
    
    useEffect(() => {
        checkAddServiceButtonState();
    }, [service, isCardService, isPortService]);
    
    return isAddServiceEnabled;
};

export default useAddServiceState;

// This Hook is for Managing Add Card button State
import { useEffect, useState } from 'react';

const useAddCardState = (service) => {
    const [addCardRefreshFlag, setAddCardRefreshFlag] = useState(false);
    
    const checkAddCardButtonState = () => {
        if (service.card !== 'Empty Slot') {
            if (addCardRefreshFlag) {
                setAddCardRefreshFlag(false);
            }
        } else {
            setAddCardRefreshFlag(true);
        }
    };
    
    useEffect(() => {
        checkAddCardButtonState();
    }, [service]);
    
    return addCardRefreshFlag;
};

export default useAddCardState;

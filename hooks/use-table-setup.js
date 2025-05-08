import { getLogger } from '@/utils/logger/logger';
import useOrderStore from '@/store/useOrderStore';

export function useTableSetup(engineeringName) {
    const logger = getLogger('TableSetup');
    logger.info(`Inside useTableSetup - engineeringName is ${engineeringName}`);
    
    const { secondStep } = useOrderStore();
    
    // Extract the relevant parts from engineeringName
    const portEngineeringName = engineeringName;
    const parts = portEngineeringName.split('-');
    const lastPart = parts[parts.length - 1]; // Extract '2B.1.3.H.VIP'
    const subParts = lastPart.split('.');
    
    // Join the relevant subparts to form the result '2B.1.3.H'
    const result = subParts.slice(0, subParts.length - 1).join('.');
    
    // Construct the portFriendlyName using site and country from secondStep
    const portFriendlyName = `${secondStep.site} ${secondStep.country} AP VIP-${result}`;
    
    logger.info(`useTableSetup - portEngineeringName: ${portEngineeringName}, portFriendlyName: ${portFriendlyName}`);
    
    return {
        portEngineeringName,
        portFriendlyName
    };
}


// Fix the naming for both when Hitless - TGL-ULHZ-A1105-2B.1.3.H.VIP.TX2
// Fix the naming for both when Non-Hitless - TGL-ULHZ-A1105-2B.1.3.A.VIP.TX2 - For Path A
// Fix the naming for both when Non-Hitless - TGL-ULHZ-A1105-2B.1.3.B.VIP.TX2 - For Path B
// VIP if in name then port already have NATFW flows
// TGL-GDIH-A1105-1B.5.3.H.RX and portFriendlyName is 'GDIH AUS AP VIP-1B.5.3.H' - How to deal for flow request VIP
// TGL-GDIH-A1105-1B.5.3.H.RX and portFriendlyName is 'GDIH AUS AP VIP-1B.5.3.H' - How to deal for Non-Hitless and Flow
// request A/B with VIP
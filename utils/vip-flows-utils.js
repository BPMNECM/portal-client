import {getLogger} from '@/utils/logger/logger';
import {mkConfig} from 'export-to-csv';

const logger = getLogger('vip-flows-utils');

export const getNextFlowNumber = (flows, direction) => {
	logger.info(`getNextFlowNumber - direction: ${direction}, flows: ${JSON.stringify(flows)}`);
	
	const flowNumbers = flows
		.filter(flow => flow.TxRx === direction && flow.flowNo && typeof flow.flowNo === 'string')
		.map(flow => {
			// Extract the numeric part of flowNo
			return Number(flow.flowNo.replace(/\D/g, ''));
		});
	
	return flowNumbers.length > 0 ? Math.max(...flowNumbers) + 1 : 1;
};

export const generateFlowNames = (engineeringName, friendlyName, TxFlows, RxFlows, startingTxCount, startingRxCount, flowType) => {
	const flows = [];
	logger.info(`generateFlowNames - engineeringName: ${engineeringName}, friendlyName: ${friendlyName}, TxFlows: ${TxFlows},
	RxFlows: ${RxFlows}, startingTxCount: ${startingTxCount}, startingRxCount: ${startingRxCount}, flowType: ${flowType}`);
	
	for (let i = 0; i < TxFlows; i++) {
		const flowNumber = startingTxCount + i; // Increment from starting count
		
		const flowEngineeringName = flowType === 'ExistingVIPFlowsTable'
			? `${engineeringName}.TX${flowNumber}`
			: `${engineeringName}.VIP.TX${flowNumber}`;
		
		const flowFriendlyName = flowType === 'ExistingVIPFlowsTable'
			? `${friendlyName}.TX${flowNumber}`
			: `${friendlyName}.VIP.TX${flowNumber}`;
		
		flows.push({
			flowNo: flowNumber,
			TxRx: 'TX',
			engineeringName: flowEngineeringName,
			friendlyName: flowFriendlyName,
			status: 'New'
		});
	}
	
	for (let i = 0; i < RxFlows; i++) {
		const flowNumber = startingRxCount + i; // Increment from starting count
		
		const flowEngineeringName = flowType === 'ExistingVIPFlowsTable'
			? `${engineeringName}.RX${flowNumber}`
			: `${engineeringName}.VIP.RX${flowNumber}`;
		
		const flowFriendlyName = flowType === 'ExistingVIPFlowsTable'
			? `${friendlyName}.RX${flowNumber}`
			: `${friendlyName}.VIP.RX${flowNumber}`;
		
		flows.push({
			flowNo: flowNumber,
			TxRx: 'RX',
			engineeringName: flowEngineeringName,
			friendlyName: flowFriendlyName,
			status: 'New'
		});
	}
	
	return flows;
};


export const isValidIp = (ip) => {
	const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	return ipRegex.test(ip);
};

export const isValidVlan = (vlan) => {
	// Check if the VLAN is a string that can be converted to a valid number
	const numericVlan = parseInt(vlan, 10);
	
	return (
		!isNaN(numericVlan) && // Check if it's a valid number
		numericVlan >= 1 &&
		numericVlan <= 4094 &&
		/^\d+$/.test(vlan) // Ensure the VLAN is composed of digits only
	);
};

export const validateFlow = (flow) => {
	logger.debug(`Validation of the flow: ${JSON.stringify(flow)} `);
	const errors = {};
	
	if (flow.customerVlan && !isValidVlan(flow.customerVlan)) {
		errors.customerVlan = 'Invalid VLAN';
	}
	
	if (flow.customerVideoIp && !isValidIp(flow.customerVideoIp)) {
		errors.customerVideoIp = 'Invalid IP Address';
	}
	
	if (flow.customerNetmask && !isValidIp(flow.customerNetmask)) {
		errors.customerNetmask = 'Invalid Netmask Address';
	}
	
	if (flow.customerGateway && !isValidIp(flow.customerGateway)) {
		errors.customerGateway = 'Invalid Gateway Address';
	}
	
	if (flow.mediaFlowSourceIp && !isValidIp(flow.mediaFlowSourceIp)) {
		errors.mediaFlowSourceIp = 'Invalid IP Address';
	}
	
	if (flow.mediaFlowDestIp && !isValidIp(flow.mediaFlowDestIp)) {
		errors.mediaFlowDestIp = 'Invalid IP Address';
	}
	
	if (flow.mediaFlowSourcePort && !isValidVlan(flow.mediaFlowSourcePort)) {
		errors.mediaFlowSourcePort = 'Invalid VLAN';
	}
	
	if (flow.mediaFlowDestPort && !isValidVlan(flow.mediaFlowDestPort)) {
		errors.mediaFlowDestPort = 'Invalid VLAN';
	}
	
	return errors;
};

export const csvConfig = mkConfig({
	fieldSeparator: ',',
	decimalSeparator: '.',
	useKeysAsHeaders: true, // Ensures headers match the keys
	filename: 'VIP_Flows_Data' // Name of the exported file
});

